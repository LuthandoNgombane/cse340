
-- Insert Tony Stark
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update Tony Stark's account_type to Admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = (SELECT account_id FROM public.account WHERE account_email = 'tony@starkent.com');

-- Delete Tony Stark
DELETE FROM public.account
WHERE account_id = (SELECT account_id FROM public.account WHERE account_email = 'tony@starkent.com');

-- Update GM Hummer description using REPLACE
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- INNER JOIN for Sport category items
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

--Update all inventory image paths to include /vehicles
UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_image, '/images/', '/images/vehicles/');
