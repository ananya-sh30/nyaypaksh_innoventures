import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import CountVectorizer
import joblib
import re
import string
import os

def train_and_save_models():
    # Define the path for saving models
    model_dir = 'saved_models'  # Make sure this directory exists

    # Check if the directory exists, if not, create it
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)

    # Load datasets
    datasets = {
        'tax': pd.read_excel('datasets/filtered_file_tax.xlsx'),
        'contract': pd.read_excel('datasets/filtered_file_contract.xlsx'),
        'dispute': pd.read_excel('datasets/filtered_file_Dispute.xlsx'),
        'property': pd.read_excel('datasets/filtered_file_Property.xlsx'),
        'corporate': pd.read_excel('datasets/filtered_file_Corporate.xlsx')
    }

    def alphanumeric(x):
        return re.sub(r'\w*\d\w*', '', str(x)) if isinstance(x, str) else x

    def pun_lower(x):
        return re.sub(r'[%s]' % re.escape(string.punctuation), '', str(x).lower()) if isinstance(x, str) else x

    def remove_n(x):
        return re.sub(r'\n', '', str(x)) if isinstance(x, str) else x

    def remove_non_ascii(x):
        return re.sub(r'[^\x00-\x7f]', r'', str(x)) if isinstance(x, str) else x

    # Preprocess datasets
    for df in datasets.values():
        # Handle missing values by filling NaNs with empty strings
        for col in ['Case keywords', 'Court Type', 'Number of evidences']:
            if col in df.columns:
                df[col] = df[col].fillna('')  # Replace NaN with empty string

                # Apply text preprocessing functions
                df[col] = (
                    df[col]
                    .map(alphanumeric)
                    .map(pun_lower)
                    .map(remove_n)
                    .map(remove_non_ascii)
                )

    # Define the target column
    target_column = 'outcome'

    # Initialize vectorizer
    vectorizer = CountVectorizer()

    for name, df in datasets.items():
        if target_column not in df.columns:
            print(f"Skipping {name} dataset as it does not contain the target column '{target_column}'.")
            continue

        # Combine text columns and transform into feature vectors
        if 'Case keywords' in df.columns and 'Court Type' in df.columns and 'Number of evidences' in df.columns:
            X = vectorizer.fit_transform(df['Case keywords'] + " " + df['Number of evidences'] + " " + df['Court Type'])
        else:
            print(f"Skipping {name} dataset due to missing required columns.")
            continue

        y = df[target_column]

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train and save each model
        models = {
            'logistic_regression': LogisticRegression(),
            'naive_bayes': MultinomialNB(),
            'svc': SVC(probability=True),
            'random_forest': RandomForestClassifier()
        }

        for model_name, model in models.items():
            print(f"Training {model_name} on {name} dataset...")
            model.fit(X_train, y_train)

            # Save the model
            model_path = os.path.join(model_dir, f"{model_name}_{name}.pkl")
            joblib.dump(model, model_path)

        # Save the vectorizer (only save it once per dataset)
        vectorizer_path = os.path.join(model_dir, f"vectorizer_{name}.pkl")
        joblib.dump(vectorizer, vectorizer_path)

    return "All models trained and saved successfully!"

# Call the function
train_and_save_models()
