/*
  Adds Random cupcake to the mongo database to begin with
 */
db = db.getSiblingDB("cupcakestore");

db.createUser({
    user: "cc_api_user",
    pwd: "cupcake",
    roles: [{ role: "readWrite", db: "cupcakestore" }],
});

db.createCollection("cupcakes");
cupcakes = Array.from({ length: 100 }, (_, i) => i + 1);
cupcakes = cupcakes.map(i => ({
    name: `vanilla_${i}`,
    description: `Classic vanilla cupcake with a twist_${i}`,
    price: 4.5,
    ingredients: ["flour", "sugar", "butter", "vanilla"],
}));
db.cupcakes.insertMany(cupcakes);

