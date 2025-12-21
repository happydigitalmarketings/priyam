DROP existing collections



C:\Users\Ayaan>mongodump --db e-commerce --out dump/


local db : 
mongodump --db "e-commerce" --out dump/

live db:

mongorestore --uri "mongodb+srv://faizalkhans:8nbSop8mXO2LdQOl@cluster0.exlst.mongodb.net/minikki?retryWrites=true&w=majority&appName=Cluster0" --drop --nsFrom="e-commerce.*" --nsTo="minikki.*" dump/e-commerce
