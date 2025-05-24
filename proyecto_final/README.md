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
Esta fase representa el despliegue de varias replicas en un unico nodo utilizando minikube, lo que permite testear la ejecucion y funcionamiento de la app dandonos la capacidad de aproximar y observar su comportamiento en orquestacion.
Para desplegar esta modalidad es necesario tener instalado minikube, una vez instalado se debe ejecutar
```bash
minikube start --nodes=1
```
Para desplegar los servicios de backend y base de datos
```bash
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/deployment.yaml
```
Por defecto se levantan 2 replicas pero se puede modificar esto en `k8s/deployment.yaml` en la linea que se encuentra comentada

## Fase 3:
Ahora nos encontramos con multiples nodos en este caso 2, corriendo varias replicas del backend y una unica replica de base de datos, se considera una buena practica el tener una unica replica de base de datos ya que esto garantiza la integridad de los datos, ademas, las bases de datos suelen estar optimizadas para sostener multiples conexiones de manera paralela y consultas en cache por lo que la escalabilidad horizontal no resulta compatible con el objetivo de integridad de los datos y no aporta significativamente en el rendimiento, ejecucion y tiempo de respuesta.

Para esta fase es requisito contar con almenos dos maquinas que sirvan de nodos y que cada nodo tenga microk8s para la clusterizacion y kubectl en sus usuarios con permisos de administracion
```bash
sudo usermod -a -G microk8s $USER
```

El nodo principal debe ejecutar el siguiente comando para obtener el join que usaran los demas nodos para conectarse como cluster
```bash
microk8s add-node
```

mientras que los demas nodos deberan ejecutar
```bash
microk8s join <ip nodo principal>:25000/<codigo de union proporcionado por el comando anterior>
```
Posteriormente se pueden cambiar los valores de la cantidad de replicas del deploy del backend para desplegar usando los comandos
```bash
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/deployment.yaml
```
