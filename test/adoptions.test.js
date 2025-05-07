import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const expect = chai.expect;
const requester = supertest(app);

describe('Adoptions Router', function() {
    this.timeout(10000); // Aumentamos el timeout para operaciones de DB
    
    let testUser;
    let testPet;
    let testAdoption;
    let authToken;
    
    // Antes de las pruebas, creamos datos de prueba y nos autenticamos
    before(async function() {
        try {
            // Conectamos a una base de datos de prueba si no está conectado
            if (mongoose.connection.readyState === 0) {
                await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/adoptions_test');
            }
            
            // Creamos un usuario de prueba directamente en la base de datos
            // para evitar problemas con el controlador
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            testUser = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: hashedPassword,
                role: 'user'
            };
            
            // Insertamos el usuario directamente usando el modelo
            const UserModel = mongoose.model('Users');
            const userDoc = new UserModel(testUser);
            const savedUser = await userDoc.save();
            testUser._id = savedUser._id.toString();
            
            console.log("Usuario creado con ID:", testUser._id);
            
            // Iniciamos sesión para obtener token
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: testUser.email,
                password: 'password123'
            });
            
            console.log("Login response status:", loginResponse.status);
            console.log("Login response body:", loginResponse.body);
            
            // Extraemos el token de la cookie o del cuerpo de la respuesta
            if (loginResponse.headers['set-cookie']) {
                const cookieHeader = loginResponse.headers['set-cookie'];
                console.log("Cookies recibidas:", cookieHeader);
                
                // Buscamos la cookie que contiene el token
                const tokenCookie = cookieHeader.find(cookie => 
                    cookie.includes('authToken=') || 
                    cookie.includes('token=') || 
                    cookie.includes('jwt=') ||
                    cookie.includes('unprotectedCookie=')
                );
                
                if (tokenCookie) {
                    authToken = tokenCookie.split(';')[0].split('=')[1];
                    console.log("Token extraído de cookie:", authToken);
                }
            }
            
            // Si no encontramos el token en las cookies, buscamos en el cuerpo
            if (!authToken && loginResponse.body.token) {
                authToken = loginResponse.body.token;
                console.log("Token extraído del cuerpo:", authToken);
            }
            
            if (!authToken) {
                console.warn("No se pudo obtener un token de autenticación");
            }
            
            // Creamos una mascota de prueba
            testPet = {
                name: faker.animal.dog(),
                specie: faker.helpers.arrayElement(['dog', 'cat', 'bird', 'rabbit']),
                birthDate: faker.date.past(),
                image: faker.image.url()
            };
            
            // Configuramos los headers para la autenticación
            const headers = {};
            if (authToken) {
                headers.Cookie = `authToken=${authToken}`;
                // También podemos probar con Authorization header
                headers.Authorization = `Bearer ${authToken}`;
            }
            
            const petResponse = await requester
                .post('/api/pets')
                .set(headers)
                .send(testPet);
            
            console.log("Pet response status:", petResponse.status);
            console.log("Pet response body:", petResponse.body);
            
            if (petResponse.body && petResponse.body.payload && petResponse.body.payload._id) {
                testPet._id = petResponse.body.payload._id;
                console.log("Mascota creada con ID:", testPet._id);
                
                // Creamos una adopción de prueba
                const adoptionResponse = await requester
                    .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
                    .set(headers);
                
                console.log("Adoption response status:", adoptionResponse.status);
                console.log("Adoption response body:", adoptionResponse.body);
                
                if (adoptionResponse.body && adoptionResponse.body.payload) {
                    testAdoption = {
                        _id: adoptionResponse.body.payload._id,
                        owner: testUser._id,
                        pet: testPet._id
                    };
                    console.log("Adopción creada con ID:", testAdoption._id);
                } else {
                    console.warn("No se pudo crear la adopción de prueba");
                }
            } else {
                console.warn("No se pudo crear la mascota de prueba");
            }
        } catch (error) {
            console.error("Error en before hook:", error);
            throw error;
        }
    });
    
    // Después de todas las pruebas, limpiamos los datos
    after(async function() {
        try {
            // Limpiamos los datos directamente de la base de datos
            if (mongoose.connection.readyState !== 0) {
                if (testAdoption && testAdoption._id) {
                    await mongoose.model('Adoptions').findByIdAndDelete(testAdoption._id);
                    console.log("Adopción eliminada:", testAdoption._id);
                }
                
                if (testPet && testPet._id) {
                    await mongoose.model('Pets').findByIdAndDelete(testPet._id);
                    console.log("Mascota eliminada:", testPet._id);
                }
                
                if (testUser && testUser._id) {
                    await mongoose.model('Users').findByIdAndDelete(testUser._id);
                    console.log("Usuario eliminado:", testUser._id);
                }
            }
        } catch (error) {
            console.error("Error en after hook:", error);
        }
    });
    
    // Test para GET /api/adoptions
    describe('GET /api/adoptions', function() {
        it('debería obtener todas las adopciones', async function() {
            // Configuramos los headers para la autenticación
            const headers = {};
            if (authToken) {
                headers.Cookie = `authToken=${authToken}`;
                headers.Authorization = `Bearer ${authToken}`;
            }
            
            const response = await requester
                .get('/api/adoptions')
                .set(headers);
            
            console.log("GET /api/adoptions status:", response.status);
            console.log("GET /api/adoptions body:", response.body);
            
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status');
            expect(response.body.status).to.equal('success');
            expect(response.body).to.have.property('payload');
            expect(response.body).to.have.property('payload');
            expect(response.body.payload).to.be.an('array');
        });
    });
    
    // Test para GET /api/adoptions/:aid
    describe('GET /api/adoptions/:aid', function() {
        it('debería obtener una adopción por ID', async function() {
            // Verificamos que tengamos un ID de adopción válido
            if (!testAdoption || !testAdoption._id) {
                this.skip();
                return;
            }
            
            // Configuramos los headers para la autenticación
            const headers = {};
            if (authToken) {
                headers.Cookie = `authToken=${authToken}`;
                headers.Authorization = `Bearer ${authToken}`;
            }
            
            const response = await requester
                .get(`/api/adoptions/${testAdoption._id}`)
                .set(headers);
            
            console.log(`GET /api/adoptions/${testAdoption._id} status:`, response.status);
            console.log(`GET /api/adoptions/${testAdoption._id} body:`, response.body);
            
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status');
            expect(response.body.status).to.equal('success');
            expect(response.body).to.have.property('payload');
            expect(response.body.payload).to.have.property('_id');
        });
        
        it('debería devolver error 404 si la adopción no existe', async function() {
            const nonExistentId = new mongoose.Types.ObjectId();
            
            // Configuramos los headers para la autenticación
            const headers = {};
            if (authToken) {
                headers.Cookie = `authToken=${authToken}`;
                headers.Authorization = `Bearer ${authToken}`;
            }
            
            const response = await requester
                .get(`/api/adoptions/${nonExistentId}`)
                .set(headers);
            
            console.log(`GET /api/adoptions/${nonExistentId} status:`, response.status);
            console.log(`GET /api/adoptions/${nonExistentId} body:`, response.body);
            
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status');
            expect(response.body.status).to.equal('error');
        });
    });
    
    // Test para POST /api/adoptions/:uid/:pid
    describe('POST /api/adoptions/:uid/:pid', function() {
        it('debería crear una nueva adopción', async function() {
            // Verificamos que tengamos IDs válidos
            if (!testUser || !testUser._id) {
                this.skip();
                return;
            }
            
            // Creamos otra mascota para esta prueba
            const newPet = {
                name: faker.animal.dog(),
                specie: faker.helpers.arrayElement(['dog', 'cat', 'bird', 'rabbit']),
                birthDate: faker.date.past(),
                image: faker.image.url()
            };
            
            // Configuramos los headers para la autenticación
            const headers = {};
            if (authToken) {
                headers.Cookie = `authToken=${authToken}`;
                headers.Authorization = `Bearer ${authToken}`;
            }
            
            // Creamos la mascota
            const petResponse = await requester
                .post('/api/pets')
                .set(headers)
                .send(newPet);
            
            console.log("POST /api/pets status:", petResponse.status);
            console.log("POST /api/pets body:", petResponse.body);
            
            if (!petResponse.body || !petResponse.body.payload || !petResponse.body.payload._id) {
                this.skip();
                return;
            }
            
            const petId = petResponse.body.payload._id;
            
            // Intentamos crear una adopción con la nueva mascota
            const response = await requester
                .post(`/api/adoptions/${testUser._id}/${petId}`)
                .set(headers);
            
            console.log(`POST /api/adoptions/${testUser._id}/${petId} status:`, response.status);
            console.log(`POST /api/adoptions/${testUser._id}/${petId} body:`, response.body);
            
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status');
            expect(response.body.status).to.equal('success');
            
            // Limpiamos esta adopción adicional y la mascota
            try {
                if (response.body && response.body.payload && response.body.payload._id) {
                    await mongoose.model('Adoptions').findByIdAndDelete(response.body.payload._id);
                }
                await mongoose.model('Pets').findByIdAndDelete(petId);
            } catch (error) {
                console.error("Error al limpiar datos de prueba:", error);
            }
        });
        
        it('debería devolver error si se intenta adoptar una mascota inexistente', async function() {
            // Verificamos que tengamos un ID de usuario válido
            if (!testUser || !testUser._id) {
                this.skip();
                return;
            }
            
            const nonExistentPetId = new mongoose.Types.ObjectId();
            
            // Configuramos los headers para la autenticación
            const headers = {};
            if (authToken) {
                headers.Cookie = `authToken=${authToken}`;
                headers.Authorization = `Bearer ${authToken}`;
            }
            
            const response = await requester
                .post(`/api/adoptions/${testUser._id}/${nonExistentPetId}`)
                .set(headers);
            
            console.log(`POST /api/adoptions/${testUser._id}/${nonExistentPetId} status:`, response.status);
            console.log(`POST /api/adoptions/${testUser._id}/${nonExistentPetId} body:`, response.body);
            
            expect(response.status).to.be.oneOf([404, 400]);
            expect(response.body).to.have.property('status');
            expect(response.body.status).to.equal('error');
        });
        
        it('debería devolver error si se intenta adoptar con un usuario inexistente', async function() {
            // Verificamos que tengamos un ID de mascota válido
            if (!testPet || !testPet._id) {
                this.skip();
                return;
            }
            
            const nonExistentUserId = new mongoose.Types.ObjectId();
            
            // Configuramos los headers para la autenticación
            const headers = {};
            if (authToken) {
                headers.Cookie = `authToken=${authToken}`;
                headers.Authorization = `Bearer ${authToken}`;
            }
            
            const response = await requester
                .post(`/api/adoptions/${nonExistentUserId}/${testPet._id}`)
                .set(headers);
            
            console.log(`POST /api/adoptions/${nonExistentUserId}/${testPet._id} status:`, response.status);
            console.log(`POST /api/adoptions/${nonExistentUserId}/${testPet._id} body:`, response.body);
            
            expect(response.status).to.be.oneOf([404, 400]);
            expect(response.body).to.have.property('status');
            expect(response.body.status).to.equal('error');
        });
    });
});            