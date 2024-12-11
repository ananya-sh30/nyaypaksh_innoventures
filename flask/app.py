from flask import Flask
from routes.predict import predict_bp
from routes.summarizer import summarizer_bp
from routes.chatbot import chatbot_bp
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Set the configuration for allowed extensions and upload folder
app.config['UPLOAD_FOLDER'] = './uploads'
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'docx', 'txt'}
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024

# Register the blueprint for prediction routes
app.register_blueprint(predict_bp, url_prefix='/api')  # All prediction routes will be under /api
app.register_blueprint(summarizer_bp, url_prefix='/api/summarizer')
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    app.run(debug=True, port=port)
