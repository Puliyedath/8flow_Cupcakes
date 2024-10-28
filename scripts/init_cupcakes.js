db = db.getSiblingDB("cupcakestore");

db.createUser({
  user: "cc_api_user",
  pwd: "cupcake",
  roles: [{ role: "readWrite", db: "cupcakestore" }],
});

db.createCollection("cupcakes");

db.cupcakes.insertOne({
  name: "Vanilla Dream",
  description: "Classic vanilla cupcake with a twist",
  price: 4.5,
  ingredients: ["flour", "sugar", "butter", "vanilla"],
});
