import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE

# 1. Cargar el dataset generado
df = pd.read_csv("empleados_formateado - empleados_formateado (1).csv")

# 2. Definir características (X) y objetivo (y)
features = ["ausencias_90d", "tardanzas_90d", "horas_extras_90d","ultima_evaluacion_superior", "ultima_evaluacion_desempeño", "satisfaccion_laboral", "fue_promocionado", "edad", "estado_civil"]
X = df[features]
y = df["salida"]  # objetivo

# 3. Dividir en train (80%) y test (20%)
#X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,stratify = y, random_state=42)

# 4. escalado de variables
#preprocessor = ColumnTransformer([("num", StandardScaler(), features)]) 
#scale_pos_weight = (y_train == 0).sum() / (y_train ==1).sum()



# 5.pipeline
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", XGBClassifier(
        objective="multi:softprob",
        num_class=3,
        eval_metric="mlogloss",
        use_label_encoder=False,
        random_state=42,
        n_estimators=100,
        learning_rate=0.1
    ))
])



# 6. entrenar
pipe.fit(X_train, y_train)


# 7. evaluar
y_pred = pipe.predict(X_test)
print("Matriz de confusión:\n", confusion_matrix(y_test, y_pred))
print("\nReporte de clasificación:\n", classification_report(
    y_test, y_pred,
    target_names=["ninguna acción","renuncia","despido"]
))


#################################
####EXPORTAR MODELO PARA USAR####
#################################
#dump(model, 'modelo_regresion_lineal.joblib')



############################
#####PREDICCION EMPLEADO####
############################

empleado = pd.DataFrame({
    "ausencias_90d":[4],
    "tardanzas_90d":[0],
  #  "salidas_90d":[0],
    "horas_extras_90d":[0],
    "ultima_evaluacion_superior":[3],
    "ultima_evaluacion_desempeño":[0.8], 
   # "proyectos_90d":[3],
    "satisfaccion_laboral":[3.0], 
    "fue_promocionado":[0],
    "edad":[40],
    "estado_civil":[0]
})

# Predecir su puntaje de desempeño
probs = pipe.predict_proba(empleado)[0]
print("\nProbabilidades:")
print(f"  Ninguna acción: {probs[0]*100:.1f}%")
print(f"  Renuncia       : {probs[1]*100:.1f}%")
print(f"  Despido        : {probs[2]*100:.1f}%")

