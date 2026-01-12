"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_node_path6 = __toESM(require("path"), 1);
var import_node_url5 = require("url");
var import_cookie = __toESM(require("@fastify/cookie"), 1);
var import_cors = require("@fastify/cors");
var import_jwt = __toESM(require("@fastify/jwt"), 1);
var import_multipart = __toESM(require("@fastify/multipart"), 1);
var import_static = __toESM(require("@fastify/static"), 1);
var import_swagger = __toESM(require("@fastify/swagger"), 1);
var import_fastify_api_reference = __toESM(require("@scalar/fastify-api-reference"), 1);
var import_fastify = __toESM(require("fastify"), 1);
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");

// src/env/env.ts
var import_config = require("dotenv/config");
var import_zod = __toESM(require("zod"), 1);
var envSchema = import_zod.default.object({
  NODE_ENV: import_zod.default.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: import_zod.default.string(),
  PORT: import_zod.default.coerce.number().default(3333),
  PRIVATE_KEY_JWT: import_zod.default.string(),
  PUBLIC_KEY_JWT: import_zod.default.string()
});
var env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  PRIVATE_KEY_JWT: process.env.PRIVATE_KEY_JWT,
  PUBLIC_KEY_JWT: process.env.PUBLIC_KEY_JWT
});

// src/routes/approved-property.routes.ts
var import_zod2 = __toESM(require("zod"), 1);

// src/database/prisma.ts
var import_config2 = require("dotenv/config");
var import_adapter_pg = require("@prisma/adapter-pg");
var import_client = require("@prisma/client");
var adapter = new import_adapter_pg.PrismaPg({
  connectionString: process.env.DATABASE_URL
});
var prisma = new import_client.PrismaClient({ adapter });

// src/functions/approved-property.ts
async function approvedProperty({ propertyId }) {
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      status: "APPROVED"
    }
  });
  return;
}

// src/routes/approved-property.routes.ts
var approvedPropertyRoutes = (app2) => {
  app2.patch(
    "/approved-property/:propertyId",
    {
      schema: {
        tags: ["Properties"],
        description: "Approve a property",
        params: import_zod2.default.object({
          propertyId: import_zod2.default.string()
        }),
        response: {
          204: import_zod2.default.object(),
          400: import_zod2.default.object({
            message: import_zod2.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params;
        await approvedProperty({
          propertyId
        });
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof import_zod2.default.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/authenticate.routes.ts
var import_zod3 = __toESM(require("zod"), 1);

// src/functions/authenticate.ts
var import_bcryptjs = require("bcryptjs");

// src/functions/errors/incorrect-email-or-password.ts
var IncorrectEmailOrPasswordError = class extends Error {
  constructor() {
    super("E-mail e/ou senha incorretos!");
  }
};

// src/functions/authenticate.ts
async function authenticate({ email, password }) {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new IncorrectEmailOrPasswordError();
  }
  const passwordCompare = await (0, import_bcryptjs.compare)(password, user.password);
  if (!passwordCompare) {
    throw new IncorrectEmailOrPasswordError();
  }
  return { user };
}

// src/routes/authenticate.routes.ts
var authenticateRoutes = (app2) => {
  app2.post(
    "/authenticate",
    {
      schema: {
        tags: ["Authenticate"],
        description: "Authenticate user",
        body: import_zod3.default.object({
          email: import_zod3.default.email(),
          password: import_zod3.default.string()
        })
      }
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const { user } = await authenticate({
          email,
          password
        });
        const token = await reply.jwtSign({
          sub: user.id
        });
        reply.setCookie("token", token, {
          path: "/",
          secure: true,
          sameSite: "none",
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1e3
        });
        return reply.status(200).send();
      } catch (error) {
        if (error instanceof IncorrectEmailOrPasswordError) {
          return reply.status(401).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/create-advertiser-individual.routes.ts
var import_zod4 = __toESM(require("zod"), 1);

// src/functions/create-advertiser-individual.ts
var import_bcryptjs2 = require("bcryptjs");

// src/functions/errors/user-already-exist.ts
var UserAlreadyExistError = class extends Error {
  constructor() {
    super("E-mail j\xE1 est\xE1 em uso, tente outro.");
  }
};

// src/functions/create-advertiser-individual.ts
async function createAdvertiserIndividual({
  name,
  email,
  password
}) {
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (userAlreadyExists) {
    throw new UserAlreadyExistError();
  }
  const passwordHash = await (0, import_bcryptjs2.hash)(password, 8);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      personType: "INDIVIDUAL",
      role: "ADVERTISER"
    }
  });
}

// src/routes/create-advertiser-individual.routes.ts
var createAdvertiserIndividualRoutes = (app2) => {
  app2.post(
    "/create-advertiser-individual",
    {
      schema: {
        tags: ["Users"],
        description: "Create a new advertiser individual",
        body: import_zod4.default.object({
          name: import_zod4.default.string(),
          email: import_zod4.default.email(),
          password: import_zod4.default.string()
        }),
        response: {
          201: import_zod4.default.object(),
          400: import_zod4.default.object({
            message: import_zod4.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { name, email, password } = request.body;
        await createAdvertiserIndividual({
          name,
          email,
          password
        });
        return reply.status(201).send();
      } catch (error) {
        if (error instanceof UserAlreadyExistError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/create-advertiser-legal.routes.ts
var import_zod5 = __toESM(require("zod"), 1);

// src/functions/create-advertiser-legal.ts
var import_bcryptjs3 = require("bcryptjs");
async function createAdvertiserLegal({
  name,
  email,
  password
}) {
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (userAlreadyExists) {
    throw new UserAlreadyExistError();
  }
  const passwordHash = await (0, import_bcryptjs3.hash)(password, 8);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      personType: "COMPANY",
      role: "ADVERTISER"
    }
  });
}

// src/routes/create-advertiser-legal.routes.ts
var createAdvertiserLegalRoutes = (app2) => {
  app2.post(
    "/create-advertiser-legal",
    {
      schema: {
        tags: ["Users"],
        description: "Create a new advertiser legal",
        body: import_zod5.default.object({
          name: import_zod5.default.string(),
          email: import_zod5.default.email(),
          password: import_zod5.default.string()
        }),
        response: {
          201: import_zod5.default.object(),
          400: import_zod5.default.object({
            message: import_zod5.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { name, email, password } = request.body;
        await createAdvertiserLegal({
          name,
          email,
          password
        });
        return reply.status(201).send();
      } catch (error) {
        if (error instanceof UserAlreadyExistError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/create-properties.routes.ts
var import_zod6 = __toESM(require("zod"), 1);

// src/functions/create-properties.ts
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path2 = __toESM(require("path"), 1);
var import_node_url = require("url");

// src/utils/add-watermark.ts
var import_node_path = __toESM(require("path"), 1);
var import_sharp = __toESM(require("sharp"), 1);
async function addWatermark(inputPath, outputPath) {
  const watermarkPath = import_node_path.default.resolve("src/assets/watermark.png");
  const watermark = await (0, import_sharp.default)(watermarkPath).resize(64).png().toBuffer();
  await (0, import_sharp.default)(inputPath).composite([
    {
      input: watermark,
      gravity: "center",
      blend: "overlay"
    }
  ]).toFile(outputPath);
  return outputPath;
}

// src/functions/errors/allowed-types-images.ts
var AllowedTypesImagesError = class extends Error {
  constructor() {
    super("Tipo de arquivo inv\xE1lido. Use jpg, jpeg ou png.");
  }
};

// src/functions/errors/maximum-15-photos-per-ad.ts
var Maximum15PhotosPerAdError = class extends Error {
  constructor() {
    super("O an\xFAncio pode ter no m\xE1ximo 15 fotos.");
  }
};

// src/functions/create-properties.ts
var import_meta = {};
var __filename = (0, import_node_url.fileURLToPath)(import_meta.url);
var __dirname = import_node_path2.default.dirname(__filename);
async function createProperties({
  address,
  iptu,
  addressNumber,
  airConditioning,
  bathrooms,
  bedrooms,
  builtArea,
  category,
  city,
  closet,
  condoFee,
  coworking,
  description,
  elevator,
  gourmetArea,
  gym,
  neighborhood,
  parkingSpots,
  petArea,
  playroom,
  pool,
  price,
  residential,
  sevantsRoom,
  stairFlights,
  suites,
  terrace,
  title,
  typeOfProperty,
  uf,
  updatedRegistry,
  zipCode,
  usersId,
  photos,
  partyRoom,
  userType,
  nameOwner,
  rgOwner,
  cpfOwner,
  emailOwner,
  phoneOwner,
  authorizationDocumentOwner,
  creciDocument,
  name,
  company,
  cnpj,
  cpf,
  rg,
  phone,
  email,
  creci
}) {
  if (userType === "mandatary" && !authorizationDocumentOwner) {
    throw new Error("Autoriza\xE7\xE3o do propriet\xE1rio \xE9 obrigat\xF3ria para mandat\xE1rios");
  }
  if (userType === "broker") {
    if (!authorizationDocumentOwner) {
      throw new Error("Autoriza\xE7\xE3o do propriet\xE1rio \xE9 obrigat\xF3ria para corretores");
    }
    if (!creciDocument) {
      throw new Error("Documento CRECI \xE9 obrigat\xF3rio para corretores");
    }
    if (!creci) {
      throw new Error("N\xFAmero do CRECI \xE9 obrigat\xF3rio para corretores");
    }
  }
  const photosArray = Array.isArray(photos) ? photos : [photos];
  const photosUrl = [];
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
  for await (const photo of photosArray) {
    if (!allowedTypes.includes(photo.mimetype)) {
      throw new AllowedTypesImagesError();
    }
  }
  if (photosArray.length >= 15) {
    throw new Maximum15PhotosPerAdError();
  }
  for await (const photo of photosArray) {
    const file = await photo.toBuffer();
    const filename = `${Date.now()}-${usersId}-${photo.filename}`;
    const originalPath = import_node_path2.default.resolve(
      __dirname,
      "../../uploads/properties",
      filename
    );
    await import_node_fs.default.promises.writeFile(originalPath, file);
    const watermarkedName = `wm-${filename}`;
    const watermarkedPath = import_node_path2.default.resolve(
      __dirname,
      "../../uploads/properties",
      watermarkedName
    );
    await addWatermark(originalPath, watermarkedPath);
    photosUrl.push(`properties/${watermarkedName}`);
    await import_node_fs.default.promises.unlink(originalPath);
  }
  let ownerDocumentFilename;
  if (authorizationDocumentOwner) {
    const authorizationDocument = authorizationDocumentOwner;
    const file = await authorizationDocument.toBuffer();
    const filename = `${Date.now()}-${usersId}-${authorizationDocument.filename}`;
    const originalPath = import_node_path2.default.resolve(
      __dirname,
      "../../uploads/owners",
      filename
    );
    await import_node_fs.default.promises.writeFile(originalPath, file);
    ownerDocumentFilename = `owners/${filename}`;
  }
  let creciDocumentFilename;
  if (creciDocument) {
    if (!allowedTypes.includes(creciDocument.mimetype)) {
      throw new Error("Documento CRECI deve ser PDF, JPG ou PNG");
    }
    const file = await creciDocument.toBuffer();
    const filename = `${Date.now()}-${usersId}-${creciDocument.filename}`;
    const originalPath = import_node_path2.default.resolve(__dirname, "../../uploads/creci", filename);
    await import_node_fs.default.promises.writeFile(originalPath, file);
    creciDocumentFilename = `creci/${filename}`;
  }
  let ownerId = "";
  if (nameOwner !== void 0) {
    const owner = await prisma.owner.create({
      data: {
        name: nameOwner ?? "",
        rg: rgOwner ?? "",
        cpf: cpfOwner ?? "",
        email: emailOwner ?? "",
        phone: phoneOwner ?? "",
        authorizationDocument: ownerDocumentFilename ?? ""
      }
    });
    ownerId = owner.id;
  }
  await prisma.user.update({
    where: {
      id: usersId
    },
    data: {
      name,
      cnpj,
      company,
      rg,
      cpf,
      email,
      phone,
      creci,
      photoCreci: creciDocumentFilename
    }
  });
  await prisma.property.create({
    data: {
      partyRoom,
      address,
      addressNumber,
      airConditioning,
      bathrooms,
      bedrooms,
      builtArea,
      category,
      city,
      closet,
      condoFee,
      coworking,
      description,
      elevator,
      gourmetArea,
      gym,
      neighborhood,
      parkingSpots,
      petArea,
      playroom,
      pool,
      price,
      residential,
      sevantsRoom,
      stairFlights,
      suites,
      terrace,
      title,
      typeOfProperty,
      uf,
      updatedRegistry,
      zipCode,
      ownerId: ownerId ? ownerId : void 0,
      usersId,
      photos: photosUrl ? photosUrl : void 0,
      iptu
    }
  });
  return {
    message: "An\xFAncio criado com sucesso."
  };
}

// src/routes/create-properties.routes.ts
var createPropertiesRoutes = (app2) => {
  app2.post(
    "/create-property",
    {
      schema: {
        tags: ["Properties"],
        description: "Create a new property listing",
        consumes: ["multipart/form-data"],
        body: import_zod6.default.object({
          title: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string().trim()
          ),
          iptu: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.coerce.number()
          ),
          addressNumber: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ),
          description: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string().trim()
          ),
          price: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.coerce.number()
          ),
          address: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string().trim()
          ),
          city: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string().trim()
          ),
          uf: import_zod6.default.preprocess((file) => file.value, import_zod6.default.string()),
          bathrooms: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.coerce.number()
          ),
          neighborhood: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string().trim()
          ),
          zipCode: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string().trim()
          ),
          photos: import_zod6.default.custom().refine((file) => file.file).refine(
            (file) => !file || file.file.bytesRead <= 2 * 1024 * 1024,
            "File size must be less than 2MB"
          ).refine((file) => !file || file.mimetype.startsWith("image"), {
            message: "File must be an image"
          }).array().optional(),
          category: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.enum(["SALE", "RENT"])
          ),
          condoFee: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.coerce.number()
          ),
          builtArea: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ),
          bedrooms: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.coerce.number()
          ),
          suites: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.coerce.number()
          ),
          updatedRegistry: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ),
          parkingSpots: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.coerce.number()
          ),
          typeOfProperty: import_zod6.default.preprocess(
            (file) => file ? file.value : void 0,
            import_zod6.default.enum([
              "HOUSE",
              "APARTMENT",
              "STUDIO",
              "LOFT",
              "LOT",
              "LAND",
              "FARM",
              "SHOPS",
              "GARAGE",
              "BUILDING",
              "SHED",
              "NO_RESIDENCIAL"
            ]).optional()
          ),
          elevator: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          airConditioning: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          closet: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          pool: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          sevantsRoom: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          terrace: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          coworking: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          gourmetArea: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          gym: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          partyRoom: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          petArea: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          playroom: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          usersId: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ),
          ownerId: import_zod6.default.preprocess((file) => file.value, import_zod6.default.string()).optional(),
          residential: import_zod6.default.preprocess(
            (val) => val?.value === "true" ? true : false,
            import_zod6.default.coerce.boolean()
          ),
          stairFlights: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.coerce.number()
          ).optional(),
          nameOwner: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          rgOwner: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          cpfOwner: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          emailOwner: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          phoneOwner: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          authorizationDocumentOwner: import_zod6.default.custom().refine((file) => file.file).refine((file) => !file || file.mimetype.startsWith("image"), {
            message: "File must be an image"
          }).optional(),
          creciDocument: import_zod6.default.custom().refine((file) => file.file).refine((file) => !file || file.mimetype.startsWith("image") || file.mimetype === "application/pdf", {
            message: "File must be an image or PDF"
          }).optional(),
          userType: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.enum(["owner", "mandatary", "broker", "legalEntity"])
          ),
          name: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          company: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          cnpj: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          cpf: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          rg: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          phone: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          email: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional(),
          creci: import_zod6.default.preprocess(
            (file) => file.value,
            import_zod6.default.string()
          ).optional()
        }),
        response: {
          201: import_zod6.default.object({
            message: import_zod6.default.string().describe("An\xFAncio criado com sucesso.")
          }),
          400: import_zod6.default.object({
            message: import_zod6.default.string().describe("")
          }),
          500: import_zod6.default.object({
            message: import_zod6.default.string().describe("")
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const {
          title,
          addressNumber,
          description,
          category,
          price,
          iptu,
          condoFee,
          photos,
          builtArea,
          bedrooms,
          suites,
          parkingSpots,
          address,
          uf,
          bathrooms,
          neighborhood,
          city,
          zipCode,
          elevator,
          airConditioning,
          closet,
          pool,
          sevantsRoom,
          terrace,
          typeOfProperty,
          coworking,
          gourmetArea,
          gym,
          ownerId,
          partyRoom,
          petArea,
          playroom,
          residential,
          stairFlights,
          usersId,
          updatedRegistry,
          userType,
          nameOwner,
          rgOwner,
          cpfOwner,
          emailOwner,
          phoneOwner,
          authorizationDocumentOwner,
          creciDocument,
          name,
          company,
          cnpj,
          cpf,
          rg,
          phone,
          email,
          creci
        } = request.body;
        const { message } = await createProperties({
          title,
          addressNumber,
          description,
          category,
          price,
          condoFee,
          photos,
          builtArea,
          iptu,
          bedrooms,
          suites,
          parkingSpots,
          address,
          uf,
          bathrooms,
          neighborhood,
          city,
          zipCode,
          usersId,
          elevator,
          airConditioning,
          closet,
          pool,
          sevantsRoom,
          terrace,
          typeOfProperty,
          coworking,
          gourmetArea,
          gym,
          ownerId,
          partyRoom,
          petArea,
          playroom,
          residential,
          stairFlights,
          updatedRegistry,
          userType,
          nameOwner,
          rgOwner,
          cpfOwner,
          emailOwner,
          phoneOwner,
          authorizationDocumentOwner,
          creciDocument,
          name,
          company,
          cnpj,
          cpf,
          rg,
          phone,
          email,
          creci
        });
        return reply.status(201).send({ message });
      } catch (error) {
        if (error instanceof Maximum15PhotosPerAdError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof AllowedTypesImagesError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof import_zod6.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof Error) {
          return reply.status(500).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/create-user-admin.routes.ts
var import_zod7 = __toESM(require("zod"), 1);

// src/functions/create-user-admin.ts
var import_bcryptjs4 = require("bcryptjs");
async function createUserAdmin({
  name,
  email,
  password
}) {
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (userAlreadyExists) {
    throw new UserAlreadyExistError();
  }
  const passwordHash = await (0, import_bcryptjs4.hash)(password, 8);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role: "ADMIN"
    }
  });
}

// src/routes/create-user-admin.routes.ts
var createUserAdminRoutes = (app2) => {
  app2.post(
    "/create-user-admin",
    {
      schema: {
        tags: ["Users"],
        description: "Create a new user admin",
        body: import_zod7.default.object({
          name: import_zod7.default.string(),
          email: import_zod7.default.email(),
          password: import_zod7.default.string()
        }),
        response: {
          201: import_zod7.default.object(),
          400: import_zod7.default.object({
            message: import_zod7.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { name, email, password } = request.body;
        await createUserAdmin({
          name,
          email,
          password
        });
        return reply.status(201).send();
      } catch (error) {
        if (error instanceof UserAlreadyExistError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/delete-property.routes.ts
var import_zod8 = __toESM(require("zod"), 1);

// src/functions/delete-property.ts
var import_node_fs2 = __toESM(require("fs"), 1);
var import_node_path3 = __toESM(require("path"), 1);
var import_node_url2 = require("url");

// src/functions/errors/property-not-found.ts
var PropertyNotFoundError = class extends Error {
  constructor() {
    super("Propriedade n\xE3o encontrada");
    this.name = "PropertyNotFoundError";
  }
};

// src/functions/delete-property.ts
var import_meta2 = {};
var __filename2 = (0, import_node_url2.fileURLToPath)(import_meta2.url);
var __dirname2 = import_node_path3.default.dirname(__filename2);
async function deleteProperty({ propertyId }) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { photos: true }
  });
  if (!property) {
    throw new PropertyNotFoundError();
  }
  const photosArray = property.photos;
  if (photosArray && Array.isArray(photosArray) && photosArray.length > 0) {
    for (const photoPath of photosArray) {
      try {
        const filename = photoPath.split("/").pop();
        if (filename) {
          const filePath = import_node_path3.default.resolve(
            __dirname2,
            "../../uploads/properties",
            filename
          );
          if (import_node_fs2.default.existsSync(filePath)) {
            await import_node_fs2.default.promises.unlink(filePath);
          }
        }
      } catch (error) {
        console.error("Erro ao deletar arquivo f\xEDsico:", error);
      }
    }
  }
  await prisma.property.delete({
    where: { id: propertyId }
  });
  return {
    message: "Propriedade deletada com sucesso",
    deletedPhotos: photosArray?.length || 0
  };
}

// src/routes/delete-property.routes.ts
var deletePropertyRoutes = (app2) => {
  app2.delete(
    "/properties/:propertyId",
    {
      schema: {
        tags: ["Properties"],
        description: "Delete a property and all its photos",
        params: import_zod8.default.object({
          propertyId: import_zod8.default.string().uuid("ID da propriedade deve ser um UUID v\xE1lido")
        }),
        response: {
          200: import_zod8.default.object({
            message: import_zod8.default.string(),
            deletedPhotos: import_zod8.default.number()
          }),
          404: import_zod8.default.object({
            message: import_zod8.default.string()
          }),
          500: import_zod8.default.object({
            message: import_zod8.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params;
        const result = await deleteProperty({ propertyId });
        return reply.status(200).send(result);
      } catch (error) {
        if (error instanceof PropertyNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        console.error("Erro ao deletar propriedade:", error);
        return reply.status(500).send({ message: "Erro interno do servidor" });
      }
    }
  );
};

// src/routes/delete-property-photo.routes.ts
var import_zod9 = __toESM(require("zod"), 1);

// src/functions/delete-property-photo.ts
var import_node_fs3 = __toESM(require("fs"), 1);
var import_node_path4 = __toESM(require("path"), 1);
var import_node_url3 = require("url");

// src/functions/errors/photo-not-found.ts
var PhotoNotFoundError = class extends Error {
  constructor() {
    super("Foto n\xE3o encontrada na propriedade");
    this.name = "PhotoNotFoundError";
  }
};

// src/functions/delete-property-photo.ts
var import_meta3 = {};
var __filename3 = (0, import_node_url3.fileURLToPath)(import_meta3.url);
var __dirname3 = import_node_path4.default.dirname(__filename3);
async function deletePropertyPhoto({
  propertyId,
  photoPath
}) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { photos: true }
  });
  if (!property) {
    throw new PropertyNotFoundError();
  }
  const photosArray = property.photos;
  if (!photosArray || !Array.isArray(photosArray)) {
    throw new Error("Propriedade n\xE3o possui fotos");
  }
  if (!photosArray.includes(photoPath)) {
    throw new PhotoNotFoundError();
  }
  const updatedPhotos = photosArray.filter((photo) => photo !== photoPath);
  await prisma.property.update({
    where: { id: propertyId },
    data: { photos: updatedPhotos }
  });
  try {
    const filename = photoPath.split("/").pop();
    if (filename) {
      const filePath = import_node_path4.default.resolve(
        __dirname3,
        "../../uploads/properties",
        filename
      );
      if (import_node_fs3.default.existsSync(filePath)) {
        await import_node_fs3.default.promises.unlink(filePath);
      }
    }
  } catch (error) {
    console.error("Erro ao deletar arquivo f\xEDsico:", error);
  }
  return {
    message: "Foto deletada com sucesso",
    remainingPhotos: updatedPhotos
  };
}

// src/routes/delete-property-photo.routes.ts
var deletePropertyPhotoRoutes = (app2) => {
  app2.delete(
    "/properties/:propertyId/photos",
    {
      schema: {
        tags: ["Properties"],
        description: "Delete a photo from a property",
        params: import_zod9.default.object({
          propertyId: import_zod9.default.string().uuid("ID da propriedade deve ser um UUID v\xE1lido")
        }),
        body: import_zod9.default.object({
          photoPath: import_zod9.default.string().min(1, "O caminho da foto \xE9 obrigat\xF3rio")
        }),
        response: {
          200: import_zod9.default.object({
            message: import_zod9.default.string(),
            remainingPhotos: import_zod9.default.array(import_zod9.default.string())
          }),
          400: import_zod9.default.object({
            message: import_zod9.default.string()
          }),
          404: import_zod9.default.object({
            message: import_zod9.default.string()
          }),
          500: import_zod9.default.object({
            message: import_zod9.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params;
        const { photoPath } = request.body;
        const result = await deletePropertyPhoto({
          propertyId,
          photoPath
        });
        return reply.status(200).send(result);
      } catch (error) {
        if (error instanceof PropertyNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        if (error instanceof PhotoNotFoundError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof Error && error.message === "Propriedade n\xE3o possui fotos") {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof import_zod9.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
        console.error("Erro ao deletar foto:", error);
        return reply.status(500).send({
          message: error instanceof Error ? error.message : "Erro interno do servidor"
        });
      }
    }
  );
};

// src/routes/edit-received-property.routes.ts
var import_zod10 = __toESM(require("zod"), 1);

// src/functions/edit-received-property.ts
async function editReceivedPropety({ propertyId, title, description }) {
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      title,
      description
    }
  });
  return {
    message: "Editado com sucesso"
  };
}

// src/routes/edit-received-property.routes.ts
var editReceivedPropertyRoutes = (app2) => {
  app2.put("/properties/edit-received-property/:propertyId", {
    schema: {
      tags: ["Properties"],
      params: import_zod10.default.object({
        propertyId: import_zod10.default.uuid()
      }),
      body: import_zod10.default.object({
        title: import_zod10.default.string(),
        description: import_zod10.default.string()
      }),
      response: {
        200: import_zod10.default.object({
          message: import_zod10.default.string()
        }),
        400: import_zod10.default.object({
          message: import_zod10.default.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { propertyId } = request.params;
      const { title, description } = request.body;
      const { message } = await editReceivedPropety({
        propertyId,
        title,
        description
      });
      return reply.status(200).send({ message });
    } catch (error) {
      if (error instanceof import_zod10.default.ZodError) {
        return reply.status(400).send({
          message: error.message
        });
      }
    }
  });
};

// src/routes/get-all-property.routes.ts
var import_zod11 = __toESM(require("zod"), 1);

// src/functions/get-all-property.ts
async function getAllProperty({ pageIndex }) {
  const properties = await prisma.property.findMany({
    where: {
      statusPost: "ACTIVE"
    },
    skip: pageIndex * 10,
    take: 10,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalProperties = await prisma.property.count();
  const totalPages = Math.ceil(totalProperties / 10) ?? 1;
  return {
    properties,
    metas: {
      totalPages,
      totalProperties
    }
  };
}

// src/routes/get-all-property.routes.ts
var getAllPropertyRoutes = (app2) => {
  app2.get(
    "/properties",
    {
      schema: {
        tags: ["Properties"],
        description: "Get all properties",
        querystring: import_zod11.default.object({
          pageIndex: import_zod11.default.coerce.number().min(0).default(0)
        }),
        response: {
          200: import_zod11.default.object({
            properties: import_zod11.default.array(import_zod11.default.object({
              id: import_zod11.default.string(),
              status: import_zod11.default.enum(["PENDING", "APPROVED", "REJECTED", "REVISION"]),
              title: import_zod11.default.string(),
              description: import_zod11.default.string().nullable(),
              category: import_zod11.default.enum(["SALE", "RENT"]).nullable(),
              typeOfProperty: import_zod11.default.enum(["HOUSE", "APARTMENT", "STUDIO", "LOFT", "LOT", "LAND", "FARM", "SHOPS", "GARAGE", "BUILDING", "SHED", "NO_RESIDENCIAL"]).nullable(),
              iptu: import_zod11.default.number().nullable(),
              price: import_zod11.default.number(),
              condoFee: import_zod11.default.number().nullable(),
              photos: import_zod11.default.preprocess(
                (value) => typeof value === "string" ? JSON.parse(value) : value,
                import_zod11.default.array(import_zod11.default.string()).nullable()
              ),
              builtArea: import_zod11.default.string(),
              bedrooms: import_zod11.default.number(),
              suites: import_zod11.default.number(),
              parkingSpots: import_zod11.default.number(),
              address: import_zod11.default.string(),
              addressNumber: import_zod11.default.string().nullable(),
              uf: import_zod11.default.string().nullable(),
              bathrooms: import_zod11.default.number().nullable(),
              neighborhood: import_zod11.default.string(),
              city: import_zod11.default.string(),
              zipCode: import_zod11.default.string(),
              elevator: import_zod11.default.boolean(),
              airConditioning: import_zod11.default.boolean(),
              closet: import_zod11.default.boolean(),
              pool: import_zod11.default.boolean(),
              sevantsRoom: import_zod11.default.boolean(),
              terrace: import_zod11.default.boolean(),
              coworking: import_zod11.default.boolean(),
              gym: import_zod11.default.boolean(),
              gourmetArea: import_zod11.default.boolean(),
              partyRoom: import_zod11.default.boolean(),
              petArea: import_zod11.default.boolean(),
              playroom: import_zod11.default.boolean(),
              residential: import_zod11.default.boolean(),
              stairFlights: import_zod11.default.number().nullable(),
              ownerId: import_zod11.default.string().nullable(),
              usersId: import_zod11.default.string().nullable(),
              createdAt: import_zod11.default.date(),
              updatedAt: import_zod11.default.date(),
              updatedRegistry: import_zod11.default.string().nullable()
            })),
            metas: import_zod11.default.object({
              totalPages: import_zod11.default.number(),
              totalProperties: import_zod11.default.number()
            })
          }),
          400: import_zod11.default.object({
            message: import_zod11.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const {
          pageIndex
        } = request.query;
        const { properties, metas } = await getAllProperty({
          pageIndex
        });
        return reply.status(200).send({
          properties,
          metas
        });
      } catch (error) {
        if (error instanceof import_zod11.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/get-all-property-approved.routes.ts
var import_zod12 = __toESM(require("zod"), 1);

// src/functions/get-all-property-approved.ts
async function getAllPropertyApproved({
  pageIndex,
  category,
  neighborhood,
  minPrice,
  maxPrice,
  typeOfProperty,
  bathrooms,
  bedrooms,
  suites,
  parkingSpots,
  elevator
}) {
  const properties = await prisma.property.findMany({
    where: {
      status: "APPROVED",
      statusPost: "ACTIVE",
      category: {
        in: category ? [category] : ["SALE", "RENT"]
      },
      typeOfProperty: {
        in: typeOfProperty ? [typeOfProperty] : ["HOUSE", "APARTMENT", "STUDIO", "LOFT", "LOT", "LAND", "FARM", "SHOPS", "GARAGE", "BUILDING", "SHED", "NO_RESIDENCIAL"]
      },
      price: {
        gte: minPrice ?? 0,
        lte: maxPrice ?? Number.MAX_SAFE_INTEGER
      },
      neighborhood: {
        contains: neighborhood ?? "",
        mode: "insensitive"
      },
      bathrooms: bathrooms !== null ? bathrooms >= 5 ? { gte: 5 } : bathrooms : void 0,
      bedrooms: bedrooms !== null ? bedrooms >= 5 ? { gte: 5 } : bedrooms : void 0,
      suites: suites !== null ? suites >= 5 ? { gte: 5 } : suites : void 0,
      parkingSpots: parkingSpots !== null ? parkingSpots >= 5 ? { gte: 5 } : parkingSpots : void 0,
      elevator: elevator ?? void 0
    },
    skip: pageIndex * 10,
    take: 10,
    include: {
      User: {
        select: {
          name: true,
          phone: true
        }
      },
      owner: {
        select: {
          name: true,
          authorizationDocument: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalProperties = await prisma.property.count({
    where: {
      status: "APPROVED",
      statusPost: "ACTIVE",
      category: {
        in: category ? [category] : ["SALE", "RENT"]
      },
      typeOfProperty: {
        in: typeOfProperty ? [typeOfProperty] : ["HOUSE", "APARTMENT", "STUDIO", "LOFT", "LOT", "LAND", "FARM", "SHOPS", "GARAGE", "BUILDING", "SHED", "NO_RESIDENCIAL"]
      },
      price: {
        gte: minPrice ?? 0,
        lte: maxPrice ?? Number.MAX_SAFE_INTEGER
      },
      neighborhood: {
        contains: neighborhood ?? "",
        mode: "insensitive"
      },
      bathrooms: bathrooms !== null ? bathrooms >= 5 ? { gte: 5 } : bathrooms : void 0,
      bedrooms: bedrooms !== null ? bedrooms >= 5 ? { gte: 5 } : bedrooms : void 0,
      suites: suites !== null ? suites >= 5 ? { gte: 5 } : suites : void 0,
      parkingSpots: parkingSpots !== null ? parkingSpots >= 5 ? { gte: 5 } : parkingSpots : void 0,
      elevator: elevator ?? void 0
    }
  });
  const totalPages = Math.ceil(totalProperties / 10) ?? 1;
  return {
    properties,
    metas: {
      totalPages,
      totalProperties
    }
  };
}

// src/routes/get-all-property-approved.routes.ts
var getAllPropertApprovedRoutes = (app2) => {
  app2.get(
    "/properties-approved",
    {
      schema: {
        tags: ["Properties"],
        description: "Get all approved properties",
        querystring: import_zod12.default.object({
          pageIndex: import_zod12.default.coerce.number().min(0).default(0),
          neighborhood: import_zod12.default.string().nullable().default(null),
          category: import_zod12.default.enum(["SALE", "RENT"]).nullable().default(null),
          minPrice: import_zod12.default.coerce.number().nullable().default(null),
          maxPrice: import_zod12.default.coerce.number().nullable().default(null),
          typeOfProperty: import_zod12.default.enum([
            "HOUSE",
            "APARTMENT",
            "STUDIO",
            "LOFT",
            "LOT",
            "LAND",
            "FARM",
            "SHOPS",
            "GARAGE",
            "BUILDING",
            "SHED",
            "NO_RESIDENCIAL"
          ]).nullable().default(null),
          bathrooms: import_zod12.default.coerce.number().nullable().default(null),
          // banheiro
          bedrooms: import_zod12.default.coerce.number().nullable().default(null),
          // quarto
          suites: import_zod12.default.coerce.number().nullable().default(null),
          // suite
          parkingSpots: import_zod12.default.coerce.number().nullable().default(null),
          // vagas
          elevator: import_zod12.default.coerce.boolean().nullable().default(null)
          // elevador
        }),
        response: {
          200: import_zod12.default.object({
            properties: import_zod12.default.array(import_zod12.default.object({
              id: import_zod12.default.string(),
              status: import_zod12.default.enum(["PENDING", "APPROVED", "REJECTED", "REVISION"]),
              title: import_zod12.default.string(),
              description: import_zod12.default.string().nullable(),
              category: import_zod12.default.enum(["SALE", "RENT"]).nullable(),
              typeOfProperty: import_zod12.default.enum(["HOUSE", "APARTMENT", "STUDIO", "LOFT", "LOT", "LAND", "FARM", "SHOPS", "GARAGE", "BUILDING", "SHED", "NO_RESIDENCIAL"]).nullable(),
              iptu: import_zod12.default.number().nullable(),
              price: import_zod12.default.number(),
              condoFee: import_zod12.default.number().nullable(),
              photos: import_zod12.default.preprocess(
                (value) => typeof value === "string" ? JSON.parse(value) : value,
                import_zod12.default.array(import_zod12.default.string()).nullable()
              ),
              builtArea: import_zod12.default.string(),
              bedrooms: import_zod12.default.number(),
              suites: import_zod12.default.number(),
              parkingSpots: import_zod12.default.number(),
              address: import_zod12.default.string(),
              addressNumber: import_zod12.default.string().nullable(),
              uf: import_zod12.default.string().nullable(),
              bathrooms: import_zod12.default.number().nullable(),
              neighborhood: import_zod12.default.string(),
              city: import_zod12.default.string(),
              zipCode: import_zod12.default.string(),
              elevator: import_zod12.default.boolean(),
              airConditioning: import_zod12.default.boolean(),
              closet: import_zod12.default.boolean(),
              pool: import_zod12.default.boolean(),
              sevantsRoom: import_zod12.default.boolean(),
              terrace: import_zod12.default.boolean(),
              coworking: import_zod12.default.boolean(),
              gym: import_zod12.default.boolean(),
              gourmetArea: import_zod12.default.boolean(),
              partyRoom: import_zod12.default.boolean(),
              petArea: import_zod12.default.boolean(),
              playroom: import_zod12.default.boolean(),
              residential: import_zod12.default.boolean(),
              stairFlights: import_zod12.default.number().nullable(),
              ownerId: import_zod12.default.string().nullable(),
              usersId: import_zod12.default.string().nullable(),
              createdAt: import_zod12.default.date(),
              updatedAt: import_zod12.default.date(),
              updatedRegistry: import_zod12.default.string().nullable(),
              User: import_zod12.default.object({
                name: import_zod12.default.string(),
                phone: import_zod12.default.string().nullable()
              }).nullable(),
              owner: import_zod12.default.object({
                name: import_zod12.default.string().nullable(),
                authorizationDocument: import_zod12.default.string().nullable()
              }).nullable()
            })),
            metas: import_zod12.default.object({
              totalPages: import_zod12.default.number(),
              totalProperties: import_zod12.default.number()
            })
          }),
          400: import_zod12.default.object({
            message: import_zod12.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const {
          pageIndex,
          category,
          minPrice,
          maxPrice,
          typeOfProperty,
          bathrooms,
          bedrooms,
          suites,
          parkingSpots,
          elevator,
          neighborhood
        } = request.query;
        const { properties, metas } = await getAllPropertyApproved({
          pageIndex,
          category,
          minPrice,
          neighborhood,
          maxPrice,
          typeOfProperty,
          bathrooms,
          bedrooms,
          suites,
          parkingSpots,
          elevator
        });
        return reply.status(200).send({
          properties,
          metas
        });
      } catch (error) {
        if (error instanceof import_zod12.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/get-all-property-by-users.routes.ts
var import_zod13 = __toESM(require("zod"), 1);

// src/functions/get-all-property-by-users.ts
async function getAllPropertyByUsers({ pageIndex, usersId }) {
  const properties = await prisma.property.findMany({
    where: {
      usersId
    },
    skip: pageIndex * 10,
    take: 10,
    include: {
      User: {
        select: {
          name: true,
          phone: true
        }
      },
      owner: {
        select: {
          name: true,
          authorizationDocument: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalProperties = await prisma.property.count({
    where: {
      usersId
    }
  });
  const totalPages = Math.ceil(totalProperties / 10) ?? 1;
  return {
    properties,
    metas: {
      totalPages,
      totalProperties
    }
  };
}

// src/routes/get-all-property-by-users.routes.ts
var getAllPropertByUsersRoutes = (app2) => {
  app2.get(
    "/properties-all-by-users/:usersId",
    {
      schema: {
        tags: ["Properties"],
        description: "Get all properties by users",
        querystring: import_zod13.default.object({
          pageIndex: import_zod13.default.coerce.number().min(0).default(0)
        }),
        params: import_zod13.default.object({
          usersId: import_zod13.default.string()
        }),
        response: {
          200: import_zod13.default.object({
            properties: import_zod13.default.array(import_zod13.default.object({
              id: import_zod13.default.string(),
              status: import_zod13.default.enum(["PENDING", "APPROVED", "REJECTED", "REVISION"]),
              title: import_zod13.default.string(),
              description: import_zod13.default.string().nullable(),
              category: import_zod13.default.enum(["SALE", "RENT"]).nullable(),
              typeOfProperty: import_zod13.default.enum(["HOUSE", "APARTMENT", "STUDIO", "LOFT", "LOT", "LAND", "FARM", "SHOPS", "GARAGE", "BUILDING", "SHED", "NO_RESIDENCIAL"]).nullable(),
              iptu: import_zod13.default.number().nullable(),
              price: import_zod13.default.number(),
              condoFee: import_zod13.default.number().nullable(),
              photos: import_zod13.default.preprocess(
                (value) => typeof value === "string" ? JSON.parse(value) : value,
                import_zod13.default.array(import_zod13.default.string()).nullable()
              ),
              builtArea: import_zod13.default.string(),
              bedrooms: import_zod13.default.number(),
              suites: import_zod13.default.number(),
              parkingSpots: import_zod13.default.number(),
              address: import_zod13.default.string(),
              addressNumber: import_zod13.default.string().nullable(),
              uf: import_zod13.default.string().nullable(),
              bathrooms: import_zod13.default.number().nullable(),
              neighborhood: import_zod13.default.string(),
              city: import_zod13.default.string(),
              zipCode: import_zod13.default.string(),
              elevator: import_zod13.default.boolean(),
              airConditioning: import_zod13.default.boolean(),
              closet: import_zod13.default.boolean(),
              pool: import_zod13.default.boolean(),
              sevantsRoom: import_zod13.default.boolean(),
              terrace: import_zod13.default.boolean(),
              coworking: import_zod13.default.boolean(),
              gym: import_zod13.default.boolean(),
              gourmetArea: import_zod13.default.boolean(),
              partyRoom: import_zod13.default.boolean(),
              petArea: import_zod13.default.boolean(),
              playroom: import_zod13.default.boolean(),
              residential: import_zod13.default.boolean(),
              stairFlights: import_zod13.default.number().nullable(),
              ownerId: import_zod13.default.string().nullable(),
              usersId: import_zod13.default.string().nullable(),
              createdAt: import_zod13.default.date(),
              updatedAt: import_zod13.default.date(),
              updatedRegistry: import_zod13.default.string().nullable(),
              User: import_zod13.default.object({
                name: import_zod13.default.string(),
                phone: import_zod13.default.string().nullable()
              }).nullable(),
              owner: import_zod13.default.object({
                name: import_zod13.default.string().nullable(),
                authorizationDocument: import_zod13.default.string().nullable()
              }).nullable()
            })),
            metas: import_zod13.default.object({
              totalPages: import_zod13.default.number(),
              totalProperties: import_zod13.default.number()
            })
          }),
          400: import_zod13.default.object({
            message: import_zod13.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { pageIndex } = request.query;
        const { usersId } = request.params;
        const { properties, metas } = await getAllPropertyByUsers({
          usersId,
          pageIndex
        });
        return reply.status(200).send({
          properties,
          metas
        });
      } catch (error) {
        if (error instanceof import_zod13.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/get-details-property.ts
var import_zod14 = __toESM(require("zod"), 1);

// src/functions/get-details-property.ts
async function getDetailsProperty({ propertyId }) {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId
    },
    include: {
      owner: {
        select: {
          name: true,
          phone: true,
          email: true,
          authorizationDocument: true
        }
      },
      User: {
        select: {
          name: true,
          phone: true,
          creci: true,
          photoCreci: true,
          cnpj: true,
          company: true,
          rg: true,
          cpf: true,
          email: true,
          photo: true
        }
      }
    }
  });
  return {
    property
  };
}

// src/routes/get-details-property.ts
var getDetailsPropertyRoutes = (app2) => {
  app2.get(
    "/properties-details/:propertyId",
    {
      schema: {
        tags: ["Properties"],
        description: "Get details of a property",
        params: import_zod14.default.object({
          propertyId: import_zod14.default.string()
        }),
        response: {
          200: import_zod14.default.object({
            property: import_zod14.default.object({
              id: import_zod14.default.string(),
              status: import_zod14.default.enum(["PENDING", "APPROVED", "REJECTED", "REVISION"]),
              title: import_zod14.default.string(),
              description: import_zod14.default.string().nullable(),
              category: import_zod14.default.enum(["SALE", "RENT"]).nullable(),
              typeOfProperty: import_zod14.default.enum([
                "HOUSE",
                "APARTMENT",
                "STUDIO",
                "LOFT",
                "LOT",
                "LAND",
                "FARM",
                "SHOPS",
                "GARAGE",
                "BUILDING",
                "SHED",
                "NO_RESIDENCIAL"
              ]).nullable(),
              iptu: import_zod14.default.number().nullable(),
              price: import_zod14.default.number(),
              condoFee: import_zod14.default.number().nullable(),
              photos: import_zod14.default.preprocess(
                (value) => typeof value === "string" ? JSON.parse(value) : value,
                import_zod14.default.array(import_zod14.default.string()).nullable()
              ),
              builtArea: import_zod14.default.string(),
              bedrooms: import_zod14.default.number(),
              suites: import_zod14.default.number(),
              parkingSpots: import_zod14.default.number(),
              address: import_zod14.default.string(),
              addressNumber: import_zod14.default.string().nullable(),
              uf: import_zod14.default.string().nullable(),
              bathrooms: import_zod14.default.number().nullable(),
              neighborhood: import_zod14.default.string(),
              city: import_zod14.default.string(),
              zipCode: import_zod14.default.string(),
              elevator: import_zod14.default.boolean(),
              airConditioning: import_zod14.default.boolean(),
              closet: import_zod14.default.boolean(),
              pool: import_zod14.default.boolean(),
              sevantsRoom: import_zod14.default.boolean(),
              terrace: import_zod14.default.boolean(),
              coworking: import_zod14.default.boolean(),
              gym: import_zod14.default.boolean(),
              gourmetArea: import_zod14.default.boolean(),
              partyRoom: import_zod14.default.boolean(),
              petArea: import_zod14.default.boolean(),
              playroom: import_zod14.default.boolean(),
              residential: import_zod14.default.boolean(),
              stairFlights: import_zod14.default.number().nullable(),
              ownerId: import_zod14.default.string().nullable(),
              usersId: import_zod14.default.string().nullable(),
              createdAt: import_zod14.default.date(),
              updatedAt: import_zod14.default.date(),
              updatedRegistry: import_zod14.default.string().nullable(),
              motiveRevision: import_zod14.default.string().nullable(),
              User: import_zod14.default.object({
                name: import_zod14.default.string(),
                email: import_zod14.default.string().nullable(),
                photo: import_zod14.default.string().nullable(),
                cnpj: import_zod14.default.string().nullable(),
                company: import_zod14.default.string().nullable(),
                rg: import_zod14.default.string().nullable(),
                cpf: import_zod14.default.string().nullable(),
                phone: import_zod14.default.string().nullable(),
                creci: import_zod14.default.string().nullable(),
                photoCreci: import_zod14.default.string().nullable()
              }).nullable(),
              owner: import_zod14.default.object({
                name: import_zod14.default.string().nullable(),
                phone: import_zod14.default.string().nullable(),
                email: import_zod14.default.string().nullable(),
                authorizationDocument: import_zod14.default.string().nullable()
              }).nullable()
            }).nullable()
          }),
          400: import_zod14.default.object({
            message: import_zod14.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params;
        const { property } = await getDetailsProperty({
          propertyId
        });
        return reply.status(200).send({
          property
        });
      } catch (error) {
        if (error instanceof import_zod14.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/get-profile.routes.ts
var import_zod15 = __toESM(require("zod"), 1);

// src/functions/get-profile.ts
async function getProfile({ usersId }) {
  const user = await prisma.user.findFirst({
    where: {
      id: usersId
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      description: true,
      cpf: true,
      rg: true,
      creci: true,
      cnpj: true,
      company: true,
      role: true,
      photo: true
    }
  });
  return {
    user
  };
}

// src/middleware/ensure-authenticate.ts
async function ensureAuthenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send("Token inv\xE1lido");
  }
}

// src/routes/get-profile.routes.ts
var getProfileRoutes = (app2) => {
  app2.get(
    "/me",
    {
      onRequest: [ensureAuthenticate],
      schema: {
        tags: ["Users"],
        description: "Get user profile",
        response: {
          200: import_zod15.default.object({
            user: import_zod15.default.object({
              id: import_zod15.default.string(),
              name: import_zod15.default.string(),
              email: import_zod15.default.string(),
              description: import_zod15.default.string().nullable(),
              phone: import_zod15.default.string().nullable(),
              photo: import_zod15.default.string().nullable(),
              cpf: import_zod15.default.string().nullable(),
              rg: import_zod15.default.string().nullable(),
              cnpj: import_zod15.default.string().nullable(),
              company: import_zod15.default.string().nullable(),
              role: import_zod15.default.enum(["ADMIN", "ADVERTISER", "BROKER", "AGENT"])
            }).nullable()
          }),
          400: import_zod15.default.object({
            message: import_zod15.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { sub: id } = request.user;
        const { user } = await getProfile({
          usersId: id
        });
        return reply.status(200).send({
          user
        });
      } catch (error) {
        if (error instanceof import_zod15.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/list-of-properties-sold-rented-rejected.routes.ts
var import_zod16 = __toESM(require("zod"), 1);

// src/functions/list-of-properties-sold-rented-rejected.ts
async function listOfPropertiesSoldRentedRejected({ pageIndex }) {
  const properties = await prisma.property.findMany({
    where: {
      statusPost: "INACTIVE"
    },
    skip: pageIndex * 10,
    take: 10,
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      User: {
        select: {
          name: true
        }
      }
    }
  });
  const totalProperties = await prisma.property.count({
    where: {
      statusPost: "INACTIVE"
    }
  });
  const totalPages = Math.ceil(totalProperties / 10) ?? 1;
  return {
    properties,
    metas: {
      totalPages,
      totalProperties
    }
  };
}

// src/routes/list-of-properties-sold-rented-rejected.routes.ts
var listOfPropertiesSoldRentedRejectedRoute = (app2) => {
  app2.get("/properties/sold-rented-rejected", {
    schema: {
      tags: ["Properties"],
      summary: "List of properties sold, rented or rejected",
      description: "List of properties that have been sold, rented or rejected. Pagination of 10 items per page.",
      querystring: import_zod16.default.object({
        pageIndex: import_zod16.default.coerce.number().min(0).default(0)
      }),
      response: {
        200: import_zod16.default.object({
          properties: import_zod16.default.array(import_zod16.default.object({
            id: import_zod16.default.string(),
            title: import_zod16.default.string(),
            category: import_zod16.default.string(),
            status: import_zod16.default.string(),
            User: import_zod16.default.object({
              name: import_zod16.default.string()
            }).nullable()
          })),
          metas: import_zod16.default.object({
            totalPages: import_zod16.default.number(),
            totalProperties: import_zod16.default.number()
          })
        }),
        400: import_zod16.default.object({
          message: import_zod16.default.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { pageIndex } = request.query;
      const { properties, metas } = await listOfPropertiesSoldRentedRejected(
        { pageIndex }
      );
      return reply.status(200).send({
        properties,
        metas
      });
    } catch (error) {
      if (error instanceof import_zod16.ZodError) {
        return reply.status(400).send({
          message: error.message
        });
      }
    }
  });
};

// src/routes/logout.routes.ts
var logoutRoutes = (app2) => {
  app2.get(
    "/logout",
    {
      schema: {
        tags: ["Authenticate"],
        description: "Logout the current user by clearing the authentication cookie."
      }
    },
    async (request, reply) => {
      reply.clearCookie("token", {
        path: "/",
        secure: true,
        sameSite: "none"
      });
    }
  );
};

// src/routes/mark-as-sold-or-rented.routes.ts
var import_zod17 = __toESM(require("zod"), 1);

// src/functions/mark-as-sold-or-rented.ts
async function markAsSoldOrRented({
  propertyId
}) {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId
    },
    select: {
      category: true,
      price: true
    }
  });
  if (property?.category === "SALE") {
    await prisma.sales.create({
      data: {
        amount: property.price,
        date: /* @__PURE__ */ new Date()
      }
    });
  } else if (property?.category === "RENT") {
    await prisma.rent.create({
      data: {
        amount: property.price,
        date: /* @__PURE__ */ new Date()
      }
    });
  }
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      statusPost: "INACTIVE"
    }
  });
  return {
    message: "Im\xF3vel marcado como vendido/alugado com sucesso."
  };
}

// src/routes/mark-as-sold-or-rented.routes.ts
var markAsSoldOrRentedRoutes = (app2) => {
  app2.patch("/properties/mark-as-sold-or-rented/:propertyId", {
    schema: {
      tags: ["Properties"],
      description: "Mark a property as sold or rented",
      params: import_zod17.default.object({
        propertyId: import_zod17.default.uuid()
      }),
      response: {
        200: import_zod17.default.object({
          message: import_zod17.default.string()
        }),
        400: import_zod17.default.object({
          message: import_zod17.default.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { propertyId } = request.params;
      const { message } = await markAsSoldOrRented({ propertyId });
      return reply.status(200).send({
        message
      });
    } catch (error) {
      if (error instanceof import_zod17.ZodError) {
        return reply.status(400).send({
          message: error.message
        });
      }
    }
  });
};

// src/routes/property-review.routes.ts
var import_zod18 = __toESM(require("zod"), 1);

// src/functions/property-review.ts
var import_node_fs4 = __toESM(require("fs"), 1);
var import_node_path5 = __toESM(require("path"), 1);
var import_node_url4 = require("url");
var import_meta4 = {};
var __filename4 = (0, import_node_url4.fileURLToPath)(import_meta4.url);
var __dirname4 = import_node_path5.default.dirname(__filename4);
async function propertyReview({
  propertyId,
  title,
  description,
  category,
  typeOfProperty,
  iptu,
  price,
  condoFee,
  builtArea,
  bedrooms,
  suites,
  bathrooms,
  parkingSpots,
  updatedRegistry,
  address,
  addressNumber,
  uf,
  neighborhood,
  city,
  zipCode,
  stairFlights,
  elevator,
  airConditioning,
  pool,
  sevantsRoom,
  terrace,
  closet,
  residential,
  gourmetArea,
  gym,
  coworking,
  playroom,
  petArea,
  partyRoom,
  photos,
  keepExistingPhotos = false
}) {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
      status: "REVISION"
    }
  });
  if (!property) {
    throw new PropertyNotFoundError();
  }
  let photosUrl = [];
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (keepExistingPhotos && property.photos) {
    photosUrl = property.photos;
  }
  if (photos) {
    const photosArray = Array.isArray(photos) ? photos : [photos];
    for await (const photo of photosArray) {
      if (!allowedTypes.includes(photo.mimetype)) {
        throw new AllowedTypesImagesError();
      }
    }
    const totalPhotos = photosUrl.length + photosArray.length;
    if (totalPhotos > 15) {
      throw new Maximum15PhotosPerAdError();
    }
    for await (const photo of photosArray) {
      const file = await photo.toBuffer();
      const filename = `${Date.now()}-${property.usersId}-${photo.filename}`;
      const originalPath = import_node_path5.default.resolve(
        __dirname4,
        "../../uploads/properties",
        filename
      );
      await import_node_fs4.default.promises.writeFile(originalPath, file);
      const watermarkedName = `wm-${filename}`;
      const watermarkedPath = import_node_path5.default.resolve(
        __dirname4,
        "../../uploads/properties",
        watermarkedName
      );
      await addWatermark(originalPath, watermarkedPath);
      photosUrl.push(`properties/${watermarkedName}`);
      await import_node_fs4.default.promises.unlink(originalPath);
    }
    if (!keepExistingPhotos && property.photos) {
      const oldPhotos = property.photos;
      for (const oldPhoto of oldPhotos) {
        const oldPhotoPath = import_node_path5.default.resolve(__dirname4, "../../uploads", oldPhoto);
        try {
          await import_node_fs4.default.promises.unlink(oldPhotoPath);
        } catch (error) {
          console.warn(`N\xE3o foi poss\xEDvel remover foto antiga: ${oldPhoto}`);
        }
      }
    }
  }
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      title,
      description,
      category,
      typeOfProperty,
      iptu,
      price,
      condoFee,
      builtArea,
      bedrooms,
      suites,
      bathrooms,
      parkingSpots,
      updatedRegistry,
      address,
      addressNumber,
      uf,
      neighborhood,
      city,
      zipCode,
      stairFlights,
      elevator,
      airConditioning,
      pool,
      sevantsRoom,
      terrace,
      closet,
      residential,
      gourmetArea,
      gym,
      coworking,
      playroom,
      petArea,
      partyRoom,
      ...photosUrl.length > 0 && { photos: photosUrl },
      status: "PENDING",
      motiveRevision: null
    }
  });
  return {
    message: "Propriedade atualizada e enviada para an\xE1lise com sucesso"
  };
}

// src/routes/property-review.routes.ts
var propertyReviewRoutes = (app2) => {
  app2.put(
    "/properties/review/:propertyId",
    {
      schema: {
        tags: ["Properties"],
        description: "Update property under revision and resubmit for approval",
        consumes: ["multipart/form-data"],
        params: import_zod18.default.object({
          propertyId: import_zod18.default.string().uuid()
        }),
        body: import_zod18.default.object({
          title: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.string().trim()
          ).optional(),
          description: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.string().trim()
          ).optional(),
          category: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.enum(["SALE", "RENT"])
          ).optional(),
          typeOfProperty: import_zod18.default.preprocess(
            (file) => file ? file.value : void 0,
            import_zod18.default.enum([
              "HOUSE",
              "APARTMENT",
              "STUDIO",
              "LOFT",
              "LOT",
              "LAND",
              "FARM",
              "SHOPS",
              "GARAGE",
              "BUILDING",
              "SHED",
              "NO_RESIDENCIAL"
            ])
          ).optional(),
          iptu: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.coerce.number()
          ).optional(),
          price: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.coerce.number()
          ).optional(),
          condoFee: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.coerce.number()
          ).optional(),
          builtArea: import_zod18.default.preprocess((file) => file?.value, import_zod18.default.string()).optional(),
          bedrooms: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.coerce.number()
          ).optional(),
          suites: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.coerce.number()
          ).optional(),
          bathrooms: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.coerce.number()
          ).optional(),
          parkingSpots: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.coerce.number()
          ).optional(),
          updatedRegistry: import_zod18.default.preprocess((file) => file?.value, import_zod18.default.string()).optional(),
          address: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.string().trim()
          ).optional(),
          addressNumber: import_zod18.default.preprocess((file) => file?.value, import_zod18.default.string()).optional(),
          uf: import_zod18.default.preprocess((file) => file?.value, import_zod18.default.string()).optional(),
          neighborhood: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.string().trim()
          ).optional(),
          city: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.string().trim()
          ).optional(),
          zipCode: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.string().trim()
          ).optional(),
          stairFlights: import_zod18.default.preprocess(
            (file) => file?.value,
            import_zod18.default.coerce.number()
          ).optional(),
          elevator: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          airConditioning: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          pool: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          sevantsRoom: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          terrace: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          closet: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          residential: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          gourmetArea: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          gym: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          coworking: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          playroom: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          petArea: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          partyRoom: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional(),
          photos: import_zod18.default.custom().refine((file) => file.file).refine(
            (file) => !file || file.file.bytesRead <= 2 * 1024 * 1024,
            "File size must be less than 2MB"
          ).refine((file) => !file || file.mimetype.startsWith("image"), {
            message: "File must be an image"
          }).array().optional(),
          keepExistingPhotos: import_zod18.default.preprocess(
            (val) => val?.value === "true",
            import_zod18.default.coerce.boolean()
          ).optional()
        }),
        response: {
          200: import_zod18.default.object({
            message: import_zod18.default.string().describe(
              "Propriedade atualizada e enviada para an\xE1lise com sucesso"
            )
          }),
          400: import_zod18.default.object({
            message: import_zod18.default.string()
          }),
          404: import_zod18.default.object({
            message: import_zod18.default.string()
          }),
          500: import_zod18.default.object({
            message: import_zod18.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params;
        const {
          title,
          description,
          category,
          typeOfProperty,
          iptu,
          price,
          condoFee,
          builtArea,
          bedrooms,
          suites,
          bathrooms,
          parkingSpots,
          updatedRegistry,
          address,
          addressNumber,
          uf,
          neighborhood,
          city,
          zipCode,
          stairFlights,
          elevator,
          airConditioning,
          pool,
          sevantsRoom,
          terrace,
          closet,
          residential,
          gourmetArea,
          gym,
          coworking,
          playroom,
          petArea,
          partyRoom,
          photos,
          keepExistingPhotos
        } = request.body;
        const { message } = await propertyReview({
          propertyId,
          title,
          description,
          category,
          typeOfProperty,
          iptu,
          price,
          condoFee,
          builtArea,
          bedrooms,
          suites,
          bathrooms,
          parkingSpots,
          updatedRegistry,
          address,
          addressNumber,
          uf,
          neighborhood,
          city,
          zipCode,
          stairFlights,
          elevator,
          airConditioning,
          pool,
          sevantsRoom,
          terrace,
          closet,
          residential,
          gourmetArea,
          gym,
          coworking,
          playroom,
          petArea,
          partyRoom,
          photos,
          keepExistingPhotos
        });
        return reply.status(200).send({ message });
      } catch (error) {
        if (error instanceof PropertyNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        if (error instanceof Maximum15PhotosPerAdError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof AllowedTypesImagesError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof import_zod18.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof Error) {
          return reply.status(500).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/rejected-property.routes.ts
var import_zod19 = __toESM(require("zod"), 1);

// src/functions/rejected-property.ts
async function rejectedProperty({ propertyId }) {
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      status: "REJECTED",
      statusPost: "INACTIVE"
    }
  });
  return;
}

// src/routes/rejected-property.routes.ts
var rejectedPropertyRoutes = (app2) => {
  app2.patch(
    "/rejected-property/:propertyId",
    {
      schema: {
        tags: ["Properties"],
        description: "Reject a property",
        params: import_zod19.default.object({
          propertyId: import_zod19.default.string()
        }),
        response: {
          204: import_zod19.default.object(),
          400: import_zod19.default.object({
            message: import_zod19.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params;
        await rejectedProperty({
          propertyId
        });
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof import_zod19.default.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/revision-property.routes.ts
var import_zod20 = __toESM(require("zod"), 1);

// src/functions/revision-property.ts
async function revisionProperty({ propertyId, motive }) {
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      motiveRevision: motive,
      status: "REVISION"
    }
  });
  return;
}

// src/routes/revision-property.routes.ts
var revisionPropertyRoutes = (app2) => {
  app2.patch(
    "/revision-property/:propertyId",
    {
      schema: {
        tags: ["Properties"],
        description: "Revision a property",
        params: import_zod20.default.object({
          propertyId: import_zod20.default.string()
        }),
        body: import_zod20.default.object({
          motive: import_zod20.default.string()
        }),
        response: {
          204: import_zod20.default.object(),
          400: import_zod20.default.object({
            message: import_zod20.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params;
        const { motive } = request.body;
        await revisionProperty({
          propertyId,
          motive
        });
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof import_zod20.default.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/set-featured-photo.routes.ts
var import_zod21 = __toESM(require("zod"), 1);

// src/functions/set-featured-photo.ts
async function setFeaturedPhoto({
  propertyId,
  photoPath
}) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { photos: true }
  });
  if (!property) {
    throw new PropertyNotFoundError();
  }
  const photosArray = property.photos;
  if (!photosArray || !Array.isArray(photosArray)) {
    throw new Error("Propriedade n\xE3o possui fotos");
  }
  if (!photosArray.includes(photoPath)) {
    throw new PhotoNotFoundError();
  }
  const filteredPhotos = photosArray.filter((photo) => photo !== photoPath);
  const reorderedPhotos = [photoPath, ...filteredPhotos];
  await prisma.property.update({
    where: { id: propertyId },
    data: { photos: reorderedPhotos }
  });
  return {
    message: "Foto definida como destaque com sucesso",
    featuredPhoto: photoPath,
    photos: reorderedPhotos
  };
}

// src/routes/set-featured-photo.routes.ts
var setFeaturedPhotoRoutes = (app2) => {
  app2.patch(
    "/properties/:propertyId/photos/featured",
    {
      schema: {
        tags: ["Properties"],
        description: "Set a photo as featured (first position in carousel)",
        params: import_zod21.default.object({
          propertyId: import_zod21.default.uuid("ID da propriedade deve ser um UUID v\xE1lido")
        }),
        body: import_zod21.default.object({
          photoPath: import_zod21.default.string().min(1, "O caminho da foto \xE9 obrigat\xF3rio")
        }),
        response: {
          200: import_zod21.default.object({
            message: import_zod21.default.string(),
            featuredPhoto: import_zod21.default.string(),
            photos: import_zod21.default.array(import_zod21.default.string())
          }),
          400: import_zod21.default.object({
            message: import_zod21.default.string()
          }),
          404: import_zod21.default.object({
            message: import_zod21.default.string()
          }),
          500: import_zod21.default.object({
            message: import_zod21.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params;
        const { photoPath } = request.body;
        const result = await setFeaturedPhoto({
          propertyId,
          photoPath
        });
        return reply.status(200).send(result);
      } catch (error) {
        if (error instanceof PropertyNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        if (error instanceof PhotoNotFoundError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof Error && error.message === "Propriedade n\xE3o possui fotos") {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof import_zod21.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
        console.error("Erro ao definir foto como destaque:", error);
        return reply.status(500).send({
          message: error instanceof Error ? error.message : "Erro interno do servidor"
        });
      }
    }
  );
};

// src/routes/state-property.routes.ts
var import_zod22 = __toESM(require("zod"), 1);

// src/functions/state-property.ts
async function stateProperty({ propertyId, state }) {
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      state
    }
  });
}

// src/routes/state-property.routes.ts
var statePropertyRoutes = (app2) => {
  app2.patch(
    "/state-property/:propertyId",
    {
      schema: {
        tags: ["Properties"],
        description: "Change the state of a property",
        params: import_zod22.default.object({
          propertyId: import_zod22.default.string()
        }),
        body: import_zod22.default.object({
          state: import_zod22.default.enum(["ACTIVE", "INACTIVE"])
        }),
        response: {
          204: import_zod22.default.object({}),
          400: import_zod22.default.object({
            message: import_zod22.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params;
        const { state } = request.body;
        await stateProperty({
          propertyId,
          state
        });
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof import_zod22.default.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/index.ts
async function routes(app2) {
  app2.register(authenticateRoutes);
  app2.register(getProfileRoutes);
  app2.register(logoutRoutes);
  app2.register(createPropertiesRoutes);
  app2.register(getAllPropertyRoutes);
  app2.register(getDetailsPropertyRoutes);
  app2.register(deletePropertyPhotoRoutes);
  app2.register(deletePropertyRoutes);
  app2.register(setFeaturedPhotoRoutes);
  app2.register(revisionPropertyRoutes);
  app2.register(approvedPropertyRoutes);
  app2.register(rejectedPropertyRoutes);
  app2.register(getAllPropertApprovedRoutes);
  app2.register(getAllPropertByUsersRoutes);
  app2.register(statePropertyRoutes);
  app2.register(editReceivedPropertyRoutes);
  app2.register(listOfPropertiesSoldRentedRejectedRoute);
  app2.register(markAsSoldOrRentedRoutes);
  app2.register(propertyReviewRoutes);
  app2.register(createUserAdminRoutes);
  app2.register(createAdvertiserIndividualRoutes);
  app2.register(createAdvertiserLegalRoutes);
}

// src/app.ts
var import_meta5 = {};
var __filename5 = (0, import_node_url5.fileURLToPath)(import_meta5.url);
var __dirname5 = import_node_path6.default.dirname(__filename5);
var app = (0, import_fastify.default)().withTypeProvider();
app.register(import_cors.fastifyCors, {
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
});
var uploadsPath = (0, import_node_path6.join)(__dirname5, "..", "uploads");
app.register(import_multipart.default, {
  prefix: "files",
  attachFieldsToBody: true,
  limits: {
    fileSize: 2 * 1024 * 1024,
    // 2MB
    files: 15
  }
});
app.register(import_static.default, {
  root: uploadsPath,
  prefix: "/files/",
  decorateReply: true
});
app.register(import_jwt.default, {
  secret: env.PRIVATE_KEY_JWT,
  sign: {
    expiresIn: "7d"
  },
  cookie: {
    cookieName: "token",
    signed: false
  }
});
app.register(import_cookie.default);
if (env.NODE_ENV === "development") {
  app.register(import_swagger.default, {
    openapi: {
      info: {
        title: "Unik API",
        version: "1.0.0"
      }
    },
    transform: import_fastify_type_provider_zod.jsonSchemaTransform
  });
  app.register(import_fastify_api_reference.default, {
    routePrefix: "/docs",
    configuration: {
      theme: "elysiajs"
    }
  });
}
app.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
app.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
app.register(routes);

// src/server.ts
app.listen({
  port: env.PORT,
  host: "0.0.0.0"
}).then(() => {
  console.log("HTTP server running!");
});
