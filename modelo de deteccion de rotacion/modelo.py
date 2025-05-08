import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    confusion_matrix, classification_report, accuracy_score,
    precision_score, recall_score, f1_score, roc_auc_score
)
from scipy.stats import randint
import matplotlib.pyplot as plt

# === 1. Cargar y preparar los datos ===
df = pd.read_csv("hr_reducido_1000.csv")

# Codificar variable categórica
le_estado_civil = LabelEncoder()
df['Estado_Civil'] = le_estado_civil.fit_transform(df['Estado_Civil'])

# Separar variables predictoras y objetivo
X = df.drop('Estado', axis=1)
y = df['Estado']

# División en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)


# === 2. Definir búsqueda aleatoria de hiperparámetros ===
param_dist = {
    'n_estimators': randint(100, 300),
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': randint(2, 10),
    'min_samples_leaf': randint(1, 5),
    'max_features': ['sqrt', 'log2']
}

random_search = RandomizedSearchCV(
    estimator=RandomForestClassifier(class_weight='balanced', random_state=42),
    param_distributions=param_dist,
    n_iter=15,  # Reducción para ejecución más rápida
    scoring='f1',
    cv=5,
    n_jobs=-1,
    random_state=42,
    verbose=1
)

# === 3. Entrenar modelo ===
random_search.fit(X_train, y_train)
best_model = random_search.best_estimator_

###importancia de las features###

feature_names = X.columns.tolist()

importances = best_model.feature_importances_

df_importances = pd.DataFrame({
    'feature': feature_names,
    'importance': importances
}).sort_values(by='importance', ascending=False)

print(df_importances)

plt.figure(figsize=(8,4))
plt.bar(df_importances['feature'], df_importances['importance'])
plt.xticks(rotation=45, ha='right')
plt.ylabel("Importancia")
plt.title("Feature Importances - Random Forest")
plt.tight_layout()
plt.show()


# === 4. Evaluación del modelo ===
y_pred = best_model.predict(X_test)
y_proba = best_model.predict_proba(X_test)[:, 1]

print("=== Confusion Matrix ===")
print(confusion_matrix(y_test, y_pred))

print("\n=== Classification Report ===")
print(classification_report(y_test, y_pred))

print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(f"Precision: {precision_score(y_test, y_pred):.3f}")
print(f"Recall: {recall_score(y_test, y_pred):.3f}")
print(f"F1 Score: {f1_score(y_test, y_pred):.3f}")
print(f"AUC-ROC: {roc_auc_score(y_test, y_proba):.3f}")

print("\n=== Mejores Hiperparámetros ===")
print(random_search.best_params_)

# === 5. Evaluar 2 empleados nuevos ===
empleados_nuevos = pd.DataFrame([
    {
        'Evaluación_Desempeño': 82.0,
        'Ultima_Evaluacion_Superior': 85.0,
        'Satisfacción_Laboral': 70.0,
        'Fue_Promocionado': 0,
        'Edad': 30,
        'Estado_Civil': le_estado_civil.transform(['Soltero'])[0],
        'Ausencias_90d': 1,
        'Tardanzas_90d': 0,
        'Salidas_Tempranas_90d': 0,
        'Horas_Extras_90d': 5,
        'Antiguedad': 5
    },
    {
        'Evaluación_Desempeño': 50.0,
        'Ultima_Evaluacion_Superior': 45.0,
        'Satisfacción_Laboral': 40.0,
        'Fue_Promocionado': 1,
        'Edad': 26,
        'Estado_Civil': le_estado_civil.transform(['Casado'])[0],
        'Ausencias_90d': 3,
        'Tardanzas_90d': 2,
        'Salidas_Tempranas_90d': 1,
        'Horas_Extras_90d': 0,
        'Antiguedad': 2
    }
])

# 🔧 Corrección: asegurar orden correcto de columnas
empleados_nuevos = empleados_nuevos[X.columns]

# Predicciones para empleados nuevos
preds = best_model.predict(empleados_nuevos)
probs = best_model.predict_proba(empleados_nuevos)[:, 1]

for i, (pred, prob) in enumerate(zip(preds, probs), start=1):
    estado = "Despedido" if pred == 1 else "No despedido"
    print(f"\nEmpleado {i} - Predicción: {estado} | Probabilidad de despido: {prob:.2f}")


