from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import polars as pl
import numpy as np
import os

app = Flask(__name__)
CORS(app)

def load_jobs_dataframe(csv_file_path="data/job-matching_data.csv"):
    """Load job data from local CSV file as Polars DataFrame"""
    try:
        print(f"Loading jobs from CSV: {csv_file_path}")
        
        # Check if file exists
        if not os.path.exists(csv_file_path):
            raise FileNotFoundError(f"CSV file not found: {csv_file_path}")
        
        # Read CSV file with Polars (much faster than Pandas)
        df = pl.read_csv(csv_file_path)
        print(f"Loaded {len(df)} jobs from CSV")
        print(f"CSV columns: {df.columns}")
        
        # Clean and prepare data - replace null values with empty strings
        df = df.fill_null('')
        
        print(f"Successfully loaded {len(df)} job records with Polars")
        return df
        
    except Exception as e:
        print(f"Error loading CSV: {str(e)}")
        raise

def recommend_jobs(cv_text, job_df, top_n=5):
    """
    Simplified job recommendation function matching the requested pattern
    """
    try:
        # Convert CV text to single string if it's a list
        if isinstance(cv_text, list):
            cv_combined = ' '.join(cv_text)
        else:
            cv_combined = str(cv_text)
        
        print(f"Processing CV text length: {len(cv_combined)} characters")
        
        # Create combined text from available columns
        # Adapt column names based on actual CSV structure
        job_title_col = 'Job Title' if 'Job Title' in job_df.columns else 'title'
        job_desc_col = 'Job Description' if 'Job Description' in job_df.columns else 'description'
        responsibilities_col = 'Responsibilities' if 'Responsibilities' in job_df.columns else 'requirements'
        
        # Create combined_text column using Polars
        job_df = job_df.with_columns(
            (pl.col(job_title_col).fill_null('') + ' ' + 
             pl.col(job_desc_col).fill_null('') + ' ' + 
             pl.col(responsibilities_col).fill_null('')).alias('combined_text')
        )
        
        # Get combined text as list
        combined_texts = job_df['combined_text'].to_list()
        all_texts = [cv_combined] + combined_texts
        
        print(f"Processing {len(combined_texts)} job descriptions")
        
        # TF-IDF Vectorization
        tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
        tfidf_matrix = tfidf.fit_transform(all_texts)
        
        # Calculate similarities
        cv_vector = tfidf_matrix[0]
        job_vectors = tfidf_matrix[1:]
        
        similarities = cosine_similarity(cv_vector, job_vectors).flatten()
        
        # Add similarity scores to DataFrame
        job_df = job_df.with_columns(pl.Series('similarity_score', similarities))
        
        # Get top N recommendations
        recommendations = job_df.sort('similarity_score', descending=True).head(top_n)
        
        # Convert to list of dictionaries for JSON response
        recommendations_list = recommendations.select([
            job_title_col,
            job_desc_col, 
            responsibilities_col,
            'similarity_score'
        ]).to_dicts()
        
        # Rename columns for consistency in response
        for rec in recommendations_list:
            rec['title'] = rec.pop(job_title_col, '')
            rec['description'] = rec.pop(job_desc_col, '')
            rec['skills_desc'] = rec.pop(responsibilities_col, '')
        
        print(f"Found {len(recommendations_list)} recommendations")
        return recommendations_list
        
    except Exception as e:
        print(f"Error in recommend_jobs: {str(e)}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'Flask recommender server is running'})

@app.route('/recommend-jobs-batch', methods=['POST'])
def get_job_recommendations_batch():
    try:
        data = request.json
        cv_text = data.get('cv_text', '')
        
        if not cv_text:
            return jsonify({'error': 'cv_text is required'}), 400
        
        print(f"Received CV text length: {len(cv_text)} characters")
        
        # Use local CSV file
        csv_file_path = data.get('csv_file_path', 'data/job-matching_data.csv')
        top_n = data.get('top_n', 5)
        
        # Load job dataframe
        job_df = load_jobs_dataframe(csv_file_path)
        
        # Get recommendations using simplified function
        recommendations = recommend_jobs(cv_text, job_df, top_n)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'count': len(recommendations),
            'source': f'Local CSV: {csv_file_path}'
        })
        
    except Exception as e:
        print(f"Error in get_job_recommendations: {str(e)}")
        return jsonify({
            'error': 'Failed to get job recommendations',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 Starting Flask Job Recommender Server with Polars...")
    print("📊 Endpoint: POST /recommend-jobs-batch")
    print("🔍 Health check: GET /health")
    print("📄 Using CSV: data/job-matching_data.csv")
    app.run(debug=False, port=5000) 