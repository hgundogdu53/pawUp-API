CREATE TABLE posts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    pet_name TEXT NOT NULL,
    birthdate DATE NOT NULL,
    location TEXT NOT NULL,
    type_of_pet TEXT NOT NULL,
    hobbies TEXT NOT NULL,
    owner INTEGER REFERENCES users
(id) ON
DELETE CASCADE NOT NULL
);

