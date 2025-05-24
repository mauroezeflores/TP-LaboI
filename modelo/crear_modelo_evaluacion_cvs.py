import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (accuracy_score, classification_report, confusion_matrix,
                             roc_curve, auc, precision_score, recall_score, f1_score)
from sklearn.preprocessing import StandardScaler
from sklearn.exceptions import NotFittedError

from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE

import optuna
optuna.logging.set_verbosity(optuna.logging.WARNING)

# --- CONSTANTES Y CONFIGURACIÓN ---
DATA_PATH = 'dataset_evaluacion_cvs.csv' #Dataset de entrada
NOMBRE_MODELO_SALIDA = "modelo_evaluacion_cvs.joblib" # Nombre del modelo final guardado

N_OPTUNA_TRIALS_DEFAULT = 100 # Ajusta según el tiempo de cómputo disponible
CV_SPLITS = 10

# --- FUNCIONES AUXILIARES ---

def load_and_preprocess_data(data_path=DATA_PATH):
    try:
        df_original = pd.read_csv(data_path)
        print(f"Dataset '{data_path}' cargado: {df_original.shape[0]} filas, {df_original.shape[1]} columnas.")
    except FileNotFoundError:
        print(f"Error CRÍTICO: No se encontró el archivo de datos '{data_path}'.")
        return None, None, None, None, None
    
    df_for_encoding = df_original.copy()
    if 'nivel_educativo' not in df_for_encoding.columns:
        print("Error: La columna 'nivel_educativo' no se encuentra en el CSV.")
        return None, None, None, None, None
        
    df_encoded = pd.get_dummies(df_for_encoding, columns=['nivel_educativo'], drop_first=True)
    features = [col for col in df_encoded.columns if col not in ['id_candidato', 'decision_final']]
    
    expected_core_features = ['anios_experiencia', 'skills_deseables_ratio', 'peso_certificaciones']
    if not all(f in features for f in expected_core_features if 'nivel_educativo' not in f):
         print(f"Advertencia: Faltan features centrales. Features encontradas: {[f for f in features if f in expected_core_features]}")

    X_df_unscaled = df_encoded[features].copy() 
    y = df_encoded['decision_final']
    
    scaler = StandardScaler()
    X_scaled_array = scaler.fit_transform(X_df_unscaled) 
    X_scaled_df = pd.DataFrame(X_scaled_array, columns=features) 
    
    joblib.dump(scaler, 'scaler_final.joblib')
    print("Scaler guardado como 'scaler_final.joblib'")
    
    return X_scaled_df, y, features, scaler, df_original

def plot_confusion_matrix_func(cm, model_name_for_plot, threshold_for_plot):
    plt.figure(figsize=(6, 4)); sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Pred. Rechazado', 'Pred. Contratado'], yticklabels=['Real Rechazado', 'Real Contratado'])
    plt.title(f'Matriz de Confusión - {model_name_for_plot} (Umbral: {threshold_for_plot:.2f})'); plt.ylabel('Etiqueta Real'); plt.xlabel('Etiqueta Predicha'); plt.tight_layout()
    safe_model_name = model_name_for_plot.lower().replace(" ", "_").replace("(", "").replace(")", "").replace(".",""); safe_threshold_name = str(round(threshold_for_plot,2)).replace(".","p")
    filename = f'cm_{safe_model_name}_thresh{safe_threshold_name}.png'; plt.savefig(filename); plt.close(); print(f"   (Matriz de confusión guardada como '{filename}')")


def evaluate_model_performance(model, X_test, y_test, model_name="Modelo", threshold=0.5, plot_cm=True):
    if not hasattr(model, 'predict_proba'):
        y_pred = model.predict(X_test); y_pred_proba_for_roc = np.array([[1-p, p] if p==1 else [p,1-p] for p in y_pred])[:,1] if y_pred.ndim == 1 else model.predict_proba(X_test)[:,1]
    else:
        y_pred_proba_for_roc = model.predict_proba(X_test)[:, 1]
        if threshold != 0.5: y_pred = (y_pred_proba_for_roc >= threshold).astype(int)
        else: y_pred = model.predict(X_test)
    print(f"\n" + "="*25 + f" EVALUACIÓN: {model_name} (Umbral: {threshold:.2f}) " + "="*25)
    accuracy = accuracy_score(y_test, y_pred); precision = precision_score(y_test, y_pred, pos_label=1, zero_division=0)
    recall = recall_score(y_test, y_pred, pos_label=1, zero_division=0); f1 = f1_score(y_test, y_pred, pos_label=1, zero_division=0)
    fpr, tpr, _ = roc_curve(y_test, y_pred_proba_for_roc); roc_auc = auc(fpr, tpr)
    print(f"\n1. Accuracy: {accuracy:.4f}\n2. Métricas para Clase Positiva (Contratado = 1):\n   - Precision: {precision:.4f}\n   - Recall: {recall:.4f}\n   - F1-Score: {f1:.4f}")
    print(f"3. AUC: {roc_auc:.4f}\n\n4. Reporte de Clasificación:"); print(classification_report(y_test, y_pred, target_names=['Rechazado (0)', 'Contratado (1)'], zero_division=0))
    cm = confusion_matrix(y_test, y_pred); print("\n5. Matriz de Confusión:"); print(cm)
    if plot_cm: plot_confusion_matrix_func(cm, model_name, threshold)
    print("="*25 + " FIN EVALUACIÓN " + "="*25 + "\n")
    return {"accuracy": accuracy, "precision": precision, "recall": recall, "f1": f1, "auc": roc_auc, "model_name": model_name, "threshold": threshold}

def plot_feature_importances(model, features, model_name="Modelo"):
    importances_values = None; actual_model = model
    if isinstance(model, ImbPipeline): actual_model = model.named_steps['classifier']
    if hasattr(actual_model, 'feature_importances_'): importances_values = actual_model.feature_importances_
    if importances_values is not None:
        if len(features) != len(importances_values): print(f"Error en FI: Discrepancia features ({len(features)}) vs importancias ({len(importances_values)}) para {model_name}."); return
        df_imp = pd.DataFrame({'feature': features, 'importance': importances_values}).sort_values(by='importance', ascending=False)
        plt.figure(figsize=(10, max(6, len(features) * 0.35))); sns.barplot(x='importance', y='feature', data=df_imp.head(15), palette="viridis")
        plt.title(f'Top Características Importantes - {model_name}'); plt.tight_layout()
        safe_name = model_name.lower().replace(" ", "_").replace("(", "").replace(")", "").replace(".","").replace("+","_")
        filename = f'fi_{safe_name}.png'; plt.savefig(filename); plt.close()
        print(f"   (Gráfico de importancia de características para '{model_name}' guardado como '{filename}')")
    else: print(f"El modelo '{model_name}' no provee 'feature_importances_'.")


def objective_rf(trial, X_train, y_train, cv_strat):
    # Definimos los hiperparámetros a optimizar
    # Usamos SMOTE para balancear las clases en el entrenamiento
    min_samples_minority = sum(y_train==1); k_neighbors_smote = min(5, min_samples_minority - 1) if min_samples_minority > 1 else 1
    smote = SMOTE(random_state=42, k_neighbors=k_neighbors_smote); n_estimators = trial.suggest_int('n_estimators', 100, 300, step=50)
    max_depth = trial.suggest_int('max_depth', 10, 30, step=5); min_samples_split = trial.suggest_int('min_samples_split', 2, 10, step=2)
    min_samples_leaf = trial.suggest_int('min_samples_leaf', 1, 5, step=1)
    model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth, min_samples_split=min_samples_split, min_samples_leaf=min_samples_leaf, random_state=42, class_weight='balanced', n_jobs=-1 )
    pipeline = ImbPipeline([('smote', smote), ('classifier', model)]); score = cross_val_score(pipeline, X_train, y_train, cv=cv_strat, scoring='f1', n_jobs=-1); return score.mean()


def tune_model_with_optuna(X_train, y_train, objective_func, model_name_for_study, n_trials=N_OPTUNA_TRIALS_DEFAULT):
    study_name = f"{model_name_for_study}-final-focused-study"; storage_name = f"sqlite:///{study_name}.db" # Nombre de estudio único
    study = optuna.create_study(study_name=study_name, storage=storage_name, load_if_exists=True, direction='maximize')
    cv_strat = StratifiedKFold(n_splits=CV_SPLITS, shuffle=True, random_state=42)
    study.optimize(lambda trial: objective_func(trial, X_train, y_train, cv_strat), n_trials=n_trials)
    print(f"\nEstudio Optuna '{study_name}' completado.\nMejor F1-score (CV) para {model_name_for_study}: {study.best_value:.4f}\nMejores hiperparámetros: {study.best_params}")
    return study.best_params

def find_optimal_threshold(model, X_test, y_test, metric_to_optimize='f1'):
    y_pred_proba = model.predict_proba(X_test)[:, 1]; best_score = -1; best_threshold = 0.5; thresholds = np.arange(0.1, 0.91, 0.01)
    print(f"\nBuscando umbral óptimo para maximizar {metric_to_optimize.upper()} de la clase 'Contratado':\nUmbral | Precision | Recall   | F1-Score\n------------------------------------------")
    for th_val in thresholds:
        y_pred_custom = (y_pred_proba >= th_val).astype(int); p = precision_score(y_test, y_pred_custom, pos_label=1, zero_division=0)
        r = recall_score(y_test, y_pred_custom, pos_label=1, zero_division=0); f1 = f1_score(y_test, y_pred_custom, pos_label=1, zero_division=0)
        print(f"{th_val:<6.2f} | {p:<9.4f} | {r:<8.4f} | {f1:<8.4f}")
        current_score = f1 if metric_to_optimize == 'f1' else r
        if current_score > best_score: best_score = current_score; best_threshold = th_val
    print(f"Mejor Umbral para {metric_to_optimize.upper()}: {best_threshold:.2f} con {metric_to_optimize.upper()}: {best_score:.4f}"); return best_threshold

# --- Funciones para generar y predecir nuevos candidatos ---
def generate_sample_candidates(num_candidates=10):
    print(f"\n--- Generando {num_candidates} nuevos candidatos de prueba ---"); new_candidates_data = []
    for i in range(num_candidates):
        nombre = f"TestCand_{i+1}"
        if i % 4 == 0: exp = round(np.random.uniform(0.5, 2.5), 1); edu = "universitario"; skills_ratio = round(np.random.uniform(0.85, 1.0), 2); certs = np.random.randint(18, 25)
        elif i % 4 == 1: exp = round(np.random.uniform(12, 20), 1); edu = np.random.choice(["terciario", "universitario"]); skills_ratio = round(np.random.uniform(0.75, 0.95), 2); certs = np.random.randint(0, 10)
        elif i % 4 == 2: exp = round(np.random.uniform(4, 8), 1); edu = np.random.choice(["terciario", "universitario"]); skills_ratio = round(np.random.uniform(0.5, 0.75), 2); certs = np.random.randint(5, 15)
        else: exp = round(np.random.uniform(0, 3), 1); edu = np.random.choice(["secundario", "terciario"]); skills_ratio = round(np.random.uniform(0.1, 0.5), 2); certs = np.random.randint(0, 5)
        new_candidates_data.append({"id_candidato_test": 7000 + i, "nombre_display": nombre, "anios_experiencia": exp, "nivel_educativo": edu, "skills_deseables_ratio": skills_ratio, "peso_certificaciones": certs})
    return new_candidates_data

def predict_new_candidates(new_candidates_list, model_path, scaler_path, features_path, threshold_to_use):
    try:
        model = joblib.load(model_path); scaler = joblib.load(scaler_path); model_features = joblib.load(features_path)
        print(f"\n--- Modelo '{model_path}' y artefactos cargados para predicción ---\nUsando umbral: {threshold_to_use:.2f}")
    except Exception as e: print(f"Error al cargar modelo/artefactos: {e}"); return []
    df_new = pd.DataFrame(new_candidates_list); display_names = df_new.get('nombre_display', pd.Series([f"Cand_{idx}" for idx in df_new.index], name="nombre_display"))
    df_new_for_processing = df_new.drop(columns=['id_candidato_test', 'nombre_display'], errors='ignore')
    if 'nivel_educativo' not in df_new_for_processing.columns: df_new_for_processing['nivel_educativo'] = 'desconocido' 
    df_new_encoded = pd.get_dummies(df_new_for_processing, columns=['nivel_educativo'], drop_first=True)
    df_new_aligned = df_new_encoded.reindex(columns=model_features, fill_value=0)
    try: X_new_scaled = scaler.transform(df_new_aligned[model_features])
    except Exception as e: print(f"Error escalado: {e}"); return []
    try: probs = model.predict_proba(X_new_scaled)[:, 1]
    except Exception as e: print(f"Error predict_proba: {e}"); return []
    predictions = (probs >= threshold_to_use).astype(int)
    print("\n--- Resultados de Predicción para Nuevos Candidatos de Prueba ---")
    for i in range(len(new_candidates_list)):
        nombre = display_names.iloc[i]; decision_texto = "Recomendado (Contratar)" if predictions[i] == 1 else "No Recomendado (Rechazar)"
        print(f"Candidato: {nombre} -> Score ML: {probs[i]:.2%} -> Decisión: {decision_texto}")
    return predictions

# --- BLOQUE PRINCIPAL DE EJECUCIÓN ---
if __name__ == '__main__':
    print("--- Iniciando Pipeline de Entrenamiento para RandomForest Optimizado ---")
    X_scaled_df, y, features, scaler, _ = load_and_preprocess_data() # df_original no se usa aquí
    
    if X_scaled_df is None: 
        print("Finalizando script debido a error en carga de datos."); exit()
    
    # Usaremos todo X_scaled_df y 'y' para el tuning, la división train/test se hará DENTRO de Optuna.
    # Para la evaluación final y el guardado, re-entrenamos con los mejores params en TODO X_scaled_df
    # y evaluamos en un hold-out set que creamos aquí.
    X_train_final, X_test_final, y_train_final, y_test_final = train_test_split(
        X_scaled_df, y, test_size=0.25, random_state=42, stratify=y
    )

    print(f"\nOptimizando RandomForest con Optuna & SMOTE (N_TRIALS = {N_OPTUNA_TRIALS_DEFAULT}, CV_SPLITS = {CV_SPLITS})...")
    best_params_rf = tune_model_with_optuna(X_train_final, y_train_final, objective_rf, "RF_Final_Focused")
    
    # Entrenar el modelo final RF con SMOTE sobre el conjunto completo de entrenamiento
    # (Optuna ya hizo la validación cruzada con SMOTE para encontrar los mejores params)
    smote_final_rf = SMOTE(random_state=42, k_neighbors=min(5, sum(y_train_final==1)-1) if sum(y_train_final==1)>1 else 1)
    X_train_res_rf, y_train_res_rf = smote_final_rf.fit_resample(X_train_final, y_train_final)
    
    rf_produccion = RandomForestClassifier(**best_params_rf, random_state=42, class_weight='balanced', n_jobs=-1)
    rf_produccion.fit(X_train_res_rf, y_train_res_rf)
    print("RandomForest de Producción Entrenado.")
    
    # Evaluar con umbral 0.5 por defecto
    evaluate_model_performance(rf_produccion, X_test_final, y_test_final, "RF Produccion (Base 0.5)")
    plot_feature_importances(rf_produccion, features, "RF Produccion") # Graficar FI

    # Encontrar y aplicar el umbral óptimo para el modelo RF de producción
    best_threshold_rf_prod = find_optimal_threshold(rf_produccion, X_test_final, y_test_final, metric_to_optimize='f1')
    print(f"\nEvaluando RF de Producción con Umbral Óptimo: {best_threshold_rf_prod:.2f}")
    final_rf_eval_results = evaluate_model_performance(
        rf_produccion, X_test_final, y_test_final, 
        "RF Produccion Thresh", 
        threshold=best_threshold_rf_prod
    )
    # El gráfico de FI es del modelo, el umbral no lo cambia, pero podemos asociarlo con el nombre
    plot_feature_importances(rf_produccion, features, f"RF Produccion Thresh {best_threshold_rf_prod:.2f}")


    print("\n--- MÉTRICAS DEL MODELO RF DE PRODUCCIÓN (con Umbral Óptimo) ---")
    print(pd.Series(final_rf_eval_results))

    # Guardar el modelo RandomForest y artefactos
    joblib.dump(rf_produccion, NOMBRE_MODELO_SALIDA) # Usa el nombre que definiste
    joblib.dump(features, 'model_features_prod.joblib')
    joblib.dump(best_threshold_rf_prod, 'threshold_prod.joblib')
    # El scaler ya se guardó en load_and_preprocess_data como 'scaler_final.joblib'
    
    print(f"\n Modelo RandomForest de Producción guardado como '{NOMBRE_MODELO_SALIDA}'.")
    print(f"Features del modelo guardadas como 'model_features_prod.joblib'.")
    print(f"Umbral óptimo para este modelo guardado como 'threshold_prod.joblib': {best_threshold_rf_prod:.2f}")
    print(f" Scaler guardado como 'scaler_final.joblib'.")

    # --- Generar y Predecir 10 Candidatos de Prueba ---
    nuevos_candidatos_test = generate_sample_candidates(num_candidates=10)
    predict_new_candidates(nuevos_candidatos_test, 
                           NOMBRE_MODELO_SALIDA, 
                           'scaler_final.joblib', 
                           'model_features_prod.joblib', 
                           best_threshold_rf_prod)
    
    print("\n--- Pipeline de Producción para RandomForest Completado ---")