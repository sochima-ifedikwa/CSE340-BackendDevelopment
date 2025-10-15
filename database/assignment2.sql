--Data for table `account`
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')

-- Modify Tony Stark record to change account_type to Admin
UPDATE "account" 
SET account_type = 'Admin' 
WHERE account_firstname = 'Tony';

-- Delete the Tony stark record from Database
DELETE FROM "account" WHERE account_firstname = 'Tony';


-- Update all 'GM' inv_description to replace 'the small interiors' with 'a huge interior'
UPDATE "inventory"
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM';


-- Use inner join to select all vehicles with classification_name of 'Sport' from inventory and classification tables
SELECT inv_make, inv_model, classification_name 
FROM inventory
INNER JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';


-- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query
UPDATE "inventory"
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

CREATE TABLE IF NOT EXISTS public.contact_messages (
    message_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    