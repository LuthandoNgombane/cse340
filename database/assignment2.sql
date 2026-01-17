-- Insert Tony Stark
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modify Tony Stark to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete Tony Stark
DELETE FROM account
WHERE account_id = 1;

-- Modify GM Hummer Description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 11;

-- Inner Join for Sport Category
SELECT inv.inv_make, inv.inv_model, cls.classification_name
FROM inventory inv
INNER JOIN classification cls
ON inv.classification_id = cls.classification_id
WHERE cls.classification_id = 3;

-- Update Image Paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');