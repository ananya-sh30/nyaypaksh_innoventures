from PyPDF2 import PdfReader
from docx import Document
import re
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Ensure necessary nltk packages are downloaded
nltk.download('punkt')
nltk.download('stopwords')

def extract_text_from_pdf(file_path):
    try:
        with open(file_path, 'rb') as f:  # Read in binary mode
            reader = PdfReader(f)
            text = ''
            for page_num in range(len(reader.pages)):  # Process each page separately
                page_text = reader.pages[page_num].extract_text()
                if page_text:
                    text += page_text
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_text_from_docx(file_path):
    try:
        doc = Document(file_path)
        text = ''
        for para in doc.paragraphs:
            text += para.text + '\n'  # Adding newline to preserve paragraph breaks
        return text
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        return ""

# Clean up extracted text (removes extra spaces, newlines, etc.)
def clean_text(text):
    text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces and newlines with a single space
    text = text.strip()  # Remove leading/trailing spaces
    return text

def extract_key_insights(text, word_limit):
    sentences = sent_tokenize(text)

    # Tokenizing words from the text
    words = word_tokenize(text.lower())
    
    # Define stopwords
    stop_words = set(stopwords.words('english'))
    
    # Remove stopwords and count word frequencies
    filtered_words = [word for word in words if word.isalpha() and word not in stop_words]
    word_counts = Counter(filtered_words)
    
    # Focus on more meaningful keywords
    top_keywords = [item[0] for item in word_counts.most_common(20) if len(item[0]) > 3]
    
    # TF-IDF scoring for sentence importance
    vectorizer = TfidfVectorizer(stop_words='english', max_features=50)
    sentence_vectors = vectorizer.fit_transform(sentences)
    sentence_scores = sentence_vectors.sum(axis=1).A1  # Sum TF-IDF scores per sentence
    
    # Rank sentences by score
    ranked_sentences = sorted(zip(sentences, sentence_scores), key=lambda x: x[1], reverse=True)
    
    key_insights = []
    added_sentences = set()
    total_words = 0
    
    for sentence, _ in ranked_sentences:
        if len(sentence.split()) > 5 and sentence not in added_sentences:
            key_insights.append(sentence)
            added_sentences.add(sentence)
            total_words += len(sentence.split())
        
        if total_words >= word_limit:
            break
    
    if not key_insights:
        # Fallback to first few sentences
        key_insights = sentences[:min(3, len(sentences))]

    return key_insights

def generate_structured_summary(text, word_limit):
    # Clean the text
    text = clean_text(text)
    
    # Generate key insights from the text
    key_insights = extract_key_insights(text, word_limit)
    
    # Join insights to form a summary
    summary_text = ' '.join(key_insights)
    total_words_in_summary = count_words(summary_text)
    
    # Respect the word limit
    summary_words = summary_text.split()
    if len(summary_words) > word_limit:
        summary_words = summary_words[:word_limit]
        summary_text = ' '.join(summary_words)
    
    return {
        'summary': summary_text,
        'key_insights': key_insights,
        'total_words': len(summary_words)
    }

def count_words(text):
    words = text.split()
    return len(words)
