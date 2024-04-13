-- Create User table
CREATE TABLE User (
    user_id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create Recipe table
CREATE TABLE Recipe (
    recipe_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    instructions TEXT NOT NULL,
    rating FLOAT
);

-- Create Ingredient table
CREATE TABLE Ingredient (
    ingredient_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create User_Recipe table
CREATE TABLE User_Recipe (
    user_id INT,
    recipe_id INT,
    action VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id),
    PRIMARY KEY (user_id, recipe_id)
);

-- Create Recipe_Ingredient table
CREATE TABLE Recipe_Ingredient (
    recipe_id INT,
    ingredient_id INT,
    FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(ingredient_id),
    PRIMARY KEY (recipe_id, ingredient_id)
);