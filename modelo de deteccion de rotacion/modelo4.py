import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import matplotlib.pyplot as plt
from joblib import dump

# ────────────────────────────────
# 📥 Cargar el dataset
# ────────────────────────────────
df = pd.read_csv("synthetic_employee_attrition_dataset_v4.csv")

# Separar variables y target
X = df.drop(columns=["salida"])
y = df["salida"]

# Escalado
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# División
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
 )

# ────────────────────────────────
# 🤖 Entrenar modelo
# ────────────────────────────────
model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight="balanced")
model.fit(X_train, y_train)

# ────────────────────────────────
# 📊 Evaluar modelo
# ────────────────────────────────
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

print("\n📊 Classification Report:")
print(classification_report(y_test, y_pred))
print("\n📈 ROC AUC:", roc_auc_score(y_test, y_proba))
print("\n🧮 Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# ────────────────────────────────
# 📌 Importancia de variables
# ────────────────────────────────
importances = model.feature_importances_
feature_names = X.columns

feat_imp_df = pd.DataFrame({
    'Feature': feature_names,
    'Importance': importances
}).sort_values(by='Importance', ascending=False)

print("\n🔍 Top variables más importantes:")
print(feat_imp_df)

plt.figure(figsize=(10, 6))
plt.barh(feat_imp_df['Feature'][::-1], feat_imp_df['Importance'][::-1], color='steelblue')
plt.xlabel('Importancia')
plt.title('Importancia de las Variables en la Predicción de Rotación')
plt.tight_layout()
plt.show()

# ────────────────────────────────
# 👥 Empleados de prueba
# ────────────────────────────────
test_employees = pd.DataFrame([
    {'promedio_horas_mensuales': 160, 'llegadas_tarde_90d': 1, 'salidas_tempranas_90d': 1, 'ausencias_90d': 0, 'desempeno': 75, 'satisfaccion_laboral': 80},
    {'promedio_horas_mensuales': 158, 'llegadas_tarde_90d': 2, 'salidas_tempranas_90d': 1, 'ausencias_90d': 1, 'desempeno': 45, 'satisfaccion_laboral': 55},
    {'promedio_horas_mensuales': 130, 'llegadas_tarde_90d': 5, 'salidas_tempranas_90d': 4, 'ausencias_90d': 3, 'desempeno': 40, 'satisfaccion_laboral': 35},
    {'promedio_horas_mensuales': 140, 'llegadas_tarde_90d': 0, 'salidas_tempranas_90d': 1, 'ausencias_90d': 0, 'desempeno': 85, 'satisfaccion_laboral': 75},
    {'promedio_horas_mensuales': 150, 'llegadas_tarde_90d': 2, 'salidas_tempranas_90d': 2, 'ausencias_90d': 2, 'desempeno': 60, 'satisfaccion_laboral': 60},
    {'promedio_horas_mensuales': 165, 'llegadas_tarde_90d': 0, 'salidas_tempranas_90d': 0, 'ausencias_90d': 0, 'desempeno': 70, 'satisfaccion_laboral': 20},
    {'promedio_horas_mensuales': 125, 'llegadas_tarde_90d': 6, 'salidas_tempranas_90d': 5, 'ausencias_90d': 4, 'desempeno': 30, 'satisfaccion_laboral': 25},
    {'promedio_horas_mensuales': 155, 'llegadas_tarde_90d': 5, 'salidas_tempranas_90d': 5, 'ausencias_90d': 3, 'desempeno': 70, 'satisfaccion_laboral': 85},
    {'promedio_horas_mensuales': 170, 'llegadas_tarde_90d': 0, 'salidas_tempranas_90d': 0, 'ausencias_90d': 0, 'desempeno': 90, 'satisfaccion_laboral': 10},
    {'promedio_horas_mensuales': 160, 'llegadas_tarde_90d': 5, 'salidas_tempranas_90d': 0, 'ausencias_90d': 5, 'desempeno': 95, 'satisfaccion_laboral': 90},
])


# Escalar empleados de prueba
test_employees_scaled = scaler.transform(test_employees)

# Predicción
predictions = model.predict(test_employees_scaled)
probas = model.predict_proba(test_employees_scaled)[:, 1]

# Mostrar resultados
for i, (pred, prob) in enumerate(zip(predictions, probas)):
    print(f"\n👤 Empleado {i+1}: {'🔴 En riesgo' if pred == 1 else '🟢 Estable'} | Prob. rotación: {prob:.2%} | Permanencia: {1 - prob:.2%}")

dump(model, 'modelo_prediccion_de_rotacion.joblib')

dump(scaler, 'scaler.joblib')