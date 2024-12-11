from flask import Blueprint, request, jsonify
import joblib
from utils.preprocess import preprocess_input

predict_bp = Blueprint('predict', __name__)

# List of dataset names
dataset_names = ['tax', 'contract', 'dispute', 'property', 'corporate']
models = {name: {} for name in dataset_names}

# Load models and vectorizers for each dataset
for dataset in dataset_names:
    # Load only the required model based on dataset
    if dataset in ['tax', 'contract']:
        models[dataset]['naive_bayes'] = joblib.load(f'models/saved_models/naive_bayes_{dataset}.pkl')
    else:
        models[dataset]['svc'] = joblib.load(f'models/saved_models/svc_{dataset}.pkl')
    
    models[dataset]['vectorizer'] = joblib.load(f'models/saved_models/vectorizer_{dataset}.pkl')



# Define the prediction route
@predict_bp.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print(data)
    
    case_keywords = data['case_keywords']
    court_type = data['court_type']
    number_of_evidences = data['number_of_evidences']  
    dataset = data['dataset']  

    # Check if dataset exists
    if dataset not in models:
        return jsonify({'error': f"Dataset '{dataset}' not found. Available datasets: {list(models.keys())}"}), 400

    input_text = case_keywords + " " + number_of_evidences + " " + court_type
    processed_input = preprocess_input(input_text)
    
    input_vec = models[dataset]['vectorizer'].transform([processed_input])

    predictions = {}
    for model_name, model in models[dataset].items():
        if model_name != 'vectorizer':  # Skip vectorizer
            if hasattr(model, 'predict_proba'):  # Check if the model supports predict_proba
                proba = model.predict_proba(input_vec)[0][1]  # Get probability for the positive class (index 1)
                predictions[model_name] = float(proba)  # Store as float
            else:
                predictions[model_name] = float(model.predict(input_vec)[0])  # Use predict for class labels

    # Return the predictions as a JSON response
    return jsonify(predictions)
