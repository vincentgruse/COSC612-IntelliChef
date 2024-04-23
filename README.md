# IntelliChef
Team Members:
 - Vincent Gruse
 - Rahal Danthanarayana
 - Sowmya Sathi
 - Anthony Gillis Jr.
 - John (Drew) Cook

## To install required dependencies for back-end

 ```sh
pip install fastapi sqlacademy uvicorn[standard] "python-jose[cryptography]" "passlib[bcrypt]" python-multipart python-decouple
```

## To run the back end server

 ```sh
cd back-end
uvicorn main:app --reload
```

## To install required dependencies for front-end

 ```sh
cd front-end
npm i
ng s
```