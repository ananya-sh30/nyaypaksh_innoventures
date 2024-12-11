from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import logging
from utils.summarizer_module import extract_text_from_pdf, extract_text_from_docx, generate_structured_summary

summarizer_bp = Blueprint('summarizer_bp', __name__)

# Function to check allowed file types
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@summarizer_bp.route('/summarize', methods=['POST'])
def summarize():
    try:
        # Ensure UPLOAD_FOLDER exists in the application context
        upload_folder = current_app.config.get('UPLOAD_FOLDER', './uploads')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        logging.info("Summarize function called")  # Debug log for function entry
        if 'file' not in request.files:
            logging.error('No file part')
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(upload_folder, filename)

            logging.info(f"Saving file to: {os.path.abspath(file_path)}")
            
            # Save the file
            file.save(file_path)

            # Extract text based on file type
            if filename.endswith('.pdf'):
                extracted_text = extract_text_from_pdf(file_path)
            elif filename.endswith('.docx'):
                extracted_text = extract_text_from_docx(file_path)
            else: 
                with open(file_path, 'r') as f:
                    extracted_text = f.read()

            word_count = int(request.form.get('word_count', 600))  
     
            summary = generate_structured_summary(extracted_text, word_count)

            if not summary:
                logging.error('Failed to generate summary')
                return jsonify({'error': 'Failed to generate summary'}), 500

            # Extract key insights and format the summary
            key_insights = summary.get('key_insights', [])
            summary_text = ' '.join(key_insights) 

            # Ensure the summary fits within the word limit
            summary_words = summary_text.split()
            if len(summary_words) > word_count:
                summary_words = summary_words[:word_count]  # Truncate summary to word limit
            
            # Format the truncated summary
            formatted_summary = ' '.join(summary_words)

            # Return the summary and additional information
            return jsonify({
                'originalText': extracted_text,
                'summaryText': formatted_summary,  
                'keyInsights': key_insights[:10], 
                'totalWords': len(summary_words)  
            })

        logging.error('Invalid file type')
        return jsonify({'error': 'Invalid file type'}), 400
    
    except Exception as e:
        logging.error(f"Error occurred: {str(e)}")  # Log the error for debugging
        return jsonify({'error': str(e)}), 500
