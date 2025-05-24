# Backend postgres
Para desplegar las diferentes modalidades del backend y base de datos se deben ejecutar los comandos respectivos a cada fase

Resultados esperados tras cada uno de los despliegues http://localhost:3000/items
![image](https://github.com/user-attachments/assets/dc327b5f-1697-4bdb-8d50-94814e076c14)

## Fase 1: 
Para desplegar el proyecto usando docker compose, lo que usualmente se entiende como *Home Lab* debe estar ubicado en la carpeta protecto_final
```bash
cd proyecto_final
docker-compose up -d
```
## Fase 2:
Esta fase representa el despliegue en un unico nodo, lo que permite testear la ejecucion y funcionamiento de la app 
```bash
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/deployment.yaml
```

## Fase 3:
