// src/app.ts
import path6, { join } from "path";
import { fileURLToPath as fileURLToPath5 } from "url";
import fastifyCookie from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import scalarAPIReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";

// src/env/env.ts
import "dotenv/config";
import z from "zod";
var envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  PRIVATE_KEY_JWT: z.string(),
  PUBLIC_KEY_JWT: z.string()
});
var env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  PRIVATE_KEY_JWT: process.env.PRIVATE_KEY_JWT,
  PUBLIC_KEY_JWT: process.env.PUBLIC_KEY_JWT
});

// src/routes/approved-property.routes.ts
import z2 from "zod";

// src/database/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
var adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});
var prisma = new PrismaClient({ adapter });

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
        params: z2.object({
          propertyId: z2.string()
        }),
        response: {
          204: z2.object(),
          400: z2.object({
            message: z2.string()
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
        if (error instanceof z2.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/authenticate.routes.ts
import z3 from "zod";

// src/functions/authenticate.ts
import { compare } from "bcryptjs";

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
  const passwordCompare = await compare(password, user.password);
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
        body: z3.object({
          email: z3.email(),
          password: z3.string()
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
import z4 from "zod";

// src/functions/create-advertiser-individual.ts
import { hash } from "bcryptjs";

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
  const passwordHash = await hash(password, 8);
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
        body: z4.object({
          name: z4.string(),
          email: z4.email(),
          password: z4.string()
        }),
        response: {
          201: z4.object(),
          400: z4.object({
            message: z4.string()
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
import z5 from "zod";

// src/functions/create-advertiser-legal.ts
import { hash as hash2 } from "bcryptjs";
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
  const passwordHash = await hash2(password, 8);
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
        body: z5.object({
          name: z5.string(),
          email: z5.email(),
          password: z5.string()
        }),
        response: {
          201: z5.object(),
          400: z5.object({
            message: z5.string()
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
import z6, { ZodError } from "zod";

// src/functions/create-properties.ts
import fs from "fs";
import path2 from "path";
import { fileURLToPath } from "url";

// src/utils/add-watermark.ts
import path from "path";
import sharp from "sharp";
async function addWatermark(inputPath, outputPath) {
  const watermarkPath = path.resolve("src/assets/watermark.png");
  const watermark = await sharp(watermarkPath).resize(64).png().toBuffer();
  await sharp(inputPath).composite([
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
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
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
    const originalPath = path2.resolve(
      __dirname,
      "../../uploads/properties",
      filename
    );
    await fs.promises.writeFile(originalPath, file);
    const watermarkedName = `wm-${filename}`;
    const watermarkedPath = path2.resolve(
      __dirname,
      "../../uploads/properties",
      watermarkedName
    );
    await addWatermark(originalPath, watermarkedPath);
    photosUrl.push(`properties/${watermarkedName}`);
    await fs.promises.unlink(originalPath);
  }
  let ownerDocumentFilename;
  if (authorizationDocumentOwner) {
    const authorizationDocument = authorizationDocumentOwner;
    const file = await authorizationDocument.toBuffer();
    const filename = `${Date.now()}-${usersId}-${authorizationDocument.filename}`;
    const originalPath = path2.resolve(
      __dirname,
      "../../uploads/owners",
      filename
    );
    await fs.promises.writeFile(originalPath, file);
    ownerDocumentFilename = `owners/${filename}`;
  }
  let creciDocumentFilename;
  if (creciDocument) {
    if (!allowedTypes.includes(creciDocument.mimetype)) {
      throw new Error("Documento CRECI deve ser PDF, JPG ou PNG");
    }
    const file = await creciDocument.toBuffer();
    const filename = `${Date.now()}-${usersId}-${creciDocument.filename}`;
    const originalPath = path2.resolve(__dirname, "../../uploads/creci", filename);
    await fs.promises.writeFile(originalPath, file);
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
        body: z6.object({
          title: z6.preprocess(
            (file) => file.value,
            z6.string().trim()
          ),
          iptu: z6.preprocess(
            (file) => file.value,
            z6.coerce.number()
          ),
          addressNumber: z6.preprocess(
            (file) => file.value,
            z6.string()
          ),
          description: z6.preprocess(
            (file) => file.value,
            z6.string().trim()
          ),
          price: z6.preprocess(
            (file) => file.value,
            z6.coerce.number()
          ),
          address: z6.preprocess(
            (file) => file.value,
            z6.string().trim()
          ),
          city: z6.preprocess(
            (file) => file.value,
            z6.string().trim()
          ),
          uf: z6.preprocess((file) => file.value, z6.string()),
          bathrooms: z6.preprocess(
            (file) => file.value,
            z6.coerce.number()
          ),
          neighborhood: z6.preprocess(
            (file) => file.value,
            z6.string().trim()
          ),
          zipCode: z6.preprocess(
            (file) => file.value,
            z6.string().trim()
          ),
          photos: z6.custom().refine((file) => file.file).refine(
            (file) => !file || file.file.bytesRead <= 2 * 1024 * 1024,
            "File size must be less than 2MB"
          ).refine((file) => !file || file.mimetype.startsWith("image"), {
            message: "File must be an image"
          }).array().optional(),
          category: z6.preprocess(
            (file) => file.value,
            z6.enum(["SALE", "RENT"])
          ),
          condoFee: z6.preprocess(
            (file) => file.value,
            z6.coerce.number()
          ),
          builtArea: z6.preprocess(
            (file) => file.value,
            z6.string()
          ),
          bedrooms: z6.preprocess(
            (file) => file.value,
            z6.coerce.number()
          ),
          suites: z6.preprocess(
            (file) => file.value,
            z6.coerce.number()
          ),
          updatedRegistry: z6.preprocess(
            (file) => file.value,
            z6.string()
          ),
          parkingSpots: z6.preprocess(
            (file) => file.value,
            z6.coerce.number()
          ),
          typeOfProperty: z6.preprocess(
            (file) => file ? file.value : void 0,
            z6.enum([
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
          elevator: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          airConditioning: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          closet: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          pool: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          sevantsRoom: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          terrace: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          coworking: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          gourmetArea: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          gym: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          partyRoom: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          petArea: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          playroom: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          usersId: z6.preprocess(
            (file) => file.value,
            z6.string()
          ),
          ownerId: z6.preprocess((file) => file.value, z6.string()).optional(),
          residential: z6.preprocess(
            (val) => val?.value === "true" ? true : false,
            z6.coerce.boolean()
          ),
          stairFlights: z6.preprocess(
            (file) => file.value,
            z6.coerce.number()
          ).optional(),
          nameOwner: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          rgOwner: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          cpfOwner: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          emailOwner: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          phoneOwner: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          authorizationDocumentOwner: z6.custom().refine((file) => file.file).refine((file) => !file || file.mimetype.startsWith("image"), {
            message: "File must be an image"
          }).optional(),
          creciDocument: z6.custom().refine((file) => file.file).refine((file) => !file || file.mimetype.startsWith("image") || file.mimetype === "application/pdf", {
            message: "File must be an image or PDF"
          }).optional(),
          userType: z6.preprocess(
            (file) => file.value,
            z6.enum(["owner", "mandatary", "broker", "legalEntity"])
          ),
          name: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          company: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          cnpj: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          cpf: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          rg: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          phone: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          email: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional(),
          creci: z6.preprocess(
            (file) => file.value,
            z6.string()
          ).optional()
        }),
        response: {
          201: z6.object({
            message: z6.string().describe("An\xFAncio criado com sucesso.")
          }),
          400: z6.object({
            message: z6.string().describe("")
          }),
          500: z6.object({
            message: z6.string().describe("")
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
        if (error instanceof ZodError) {
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
import z7 from "zod";

// src/functions/create-user-admin.ts
import { hash as hash3 } from "bcryptjs";
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
  const passwordHash = await hash3(password, 8);
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
        body: z7.object({
          name: z7.string(),
          email: z7.email(),
          password: z7.string()
        }),
        response: {
          201: z7.object(),
          400: z7.object({
            message: z7.string()
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
import z8 from "zod";

// src/functions/delete-property.ts
import fs2 from "fs";
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// src/functions/errors/property-not-found.ts
var PropertyNotFoundError = class extends Error {
  constructor() {
    super("Propriedade n\xE3o encontrada");
    this.name = "PropertyNotFoundError";
  }
};

// src/functions/delete-property.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path3.dirname(__filename2);
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
          const filePath = path3.resolve(
            __dirname2,
            "../../uploads/properties",
            filename
          );
          if (fs2.existsSync(filePath)) {
            await fs2.promises.unlink(filePath);
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
        params: z8.object({
          propertyId: z8.string().uuid("ID da propriedade deve ser um UUID v\xE1lido")
        }),
        response: {
          200: z8.object({
            message: z8.string(),
            deletedPhotos: z8.number()
          }),
          404: z8.object({
            message: z8.string()
          }),
          500: z8.object({
            message: z8.string()
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
import z9, { ZodError as ZodError2 } from "zod";

// src/functions/delete-property-photo.ts
import fs3 from "fs";
import path4 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";

// src/functions/errors/photo-not-found.ts
var PhotoNotFoundError = class extends Error {
  constructor() {
    super("Foto n\xE3o encontrada na propriedade");
    this.name = "PhotoNotFoundError";
  }
};

// src/functions/delete-property-photo.ts
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = path4.dirname(__filename3);
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
      const filePath = path4.resolve(
        __dirname3,
        "../../uploads/properties",
        filename
      );
      if (fs3.existsSync(filePath)) {
        await fs3.promises.unlink(filePath);
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
        params: z9.object({
          propertyId: z9.string().uuid("ID da propriedade deve ser um UUID v\xE1lido")
        }),
        body: z9.object({
          photoPath: z9.string().min(1, "O caminho da foto \xE9 obrigat\xF3rio")
        }),
        response: {
          200: z9.object({
            message: z9.string(),
            remainingPhotos: z9.array(z9.string())
          }),
          400: z9.object({
            message: z9.string()
          }),
          404: z9.object({
            message: z9.string()
          }),
          500: z9.object({
            message: z9.string()
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
        if (error instanceof ZodError2) {
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
import z10 from "zod";

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
      params: z10.object({
        propertyId: z10.uuid()
      }),
      body: z10.object({
        title: z10.string(),
        description: z10.string()
      }),
      response: {
        200: z10.object({
          message: z10.string()
        }),
        400: z10.object({
          message: z10.string()
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
      if (error instanceof z10.ZodError) {
        return reply.status(400).send({
          message: error.message
        });
      }
    }
  });
};

// src/routes/get-all-property.routes.ts
import z11, { ZodError as ZodError3 } from "zod";

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
        querystring: z11.object({
          pageIndex: z11.coerce.number().min(0).default(0)
        }),
        response: {
          200: z11.object({
            properties: z11.array(z11.object({
              id: z11.string(),
              status: z11.enum(["PENDING", "APPROVED", "REJECTED", "REVISION"]),
              title: z11.string(),
              description: z11.string().nullable(),
              category: z11.enum(["SALE", "RENT"]).nullable(),
              typeOfProperty: z11.enum(["HOUSE", "APARTMENT", "STUDIO", "LOFT", "LOT", "LAND", "FARM", "SHOPS", "GARAGE", "BUILDING", "SHED", "NO_RESIDENCIAL"]).nullable(),
              iptu: z11.number().nullable(),
              price: z11.number(),
              condoFee: z11.number().nullable(),
              photos: z11.preprocess(
                (value) => typeof value === "string" ? JSON.parse(value) : value,
                z11.array(z11.string()).nullable()
              ),
              builtArea: z11.string(),
              bedrooms: z11.number(),
              suites: z11.number(),
              parkingSpots: z11.number(),
              address: z11.string(),
              addressNumber: z11.string().nullable(),
              uf: z11.string().nullable(),
              bathrooms: z11.number().nullable(),
              neighborhood: z11.string(),
              city: z11.string(),
              zipCode: z11.string(),
              elevator: z11.boolean(),
              airConditioning: z11.boolean(),
              closet: z11.boolean(),
              pool: z11.boolean(),
              sevantsRoom: z11.boolean(),
              terrace: z11.boolean(),
              coworking: z11.boolean(),
              gym: z11.boolean(),
              gourmetArea: z11.boolean(),
              partyRoom: z11.boolean(),
              petArea: z11.boolean(),
              playroom: z11.boolean(),
              residential: z11.boolean(),
              stairFlights: z11.number().nullable(),
              ownerId: z11.string().nullable(),
              usersId: z11.string().nullable(),
              createdAt: z11.date(),
              updatedAt: z11.date(),
              updatedRegistry: z11.string().nullable()
            })),
            metas: z11.object({
              totalPages: z11.number(),
              totalProperties: z11.number()
            })
          }),
          400: z11.object({
            message: z11.string()
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
        if (error instanceof ZodError3) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/get-all-property-approved.routes.ts
import z12, { ZodError as ZodError4 } from "zod";

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
        querystring: z12.object({
          pageIndex: z12.coerce.number().min(0).default(0),
          neighborhood: z12.string().nullable().default(null),
          category: z12.enum(["SALE", "RENT"]).nullable().default(null),
          minPrice: z12.coerce.number().nullable().default(null),
          maxPrice: z12.coerce.number().nullable().default(null),
          typeOfProperty: z12.enum([
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
          bathrooms: z12.coerce.number().nullable().default(null),
          // banheiro
          bedrooms: z12.coerce.number().nullable().default(null),
          // quarto
          suites: z12.coerce.number().nullable().default(null),
          // suite
          parkingSpots: z12.coerce.number().nullable().default(null),
          // vagas
          elevator: z12.coerce.boolean().nullable().default(null)
          // elevador
        }),
        response: {
          200: z12.object({
            properties: z12.array(z12.object({
              id: z12.string(),
              status: z12.enum(["PENDING", "APPROVED", "REJECTED", "REVISION"]),
              title: z12.string(),
              description: z12.string().nullable(),
              category: z12.enum(["SALE", "RENT"]).nullable(),
              typeOfProperty: z12.enum(["HOUSE", "APARTMENT", "STUDIO", "LOFT", "LOT", "LAND", "FARM", "SHOPS", "GARAGE", "BUILDING", "SHED", "NO_RESIDENCIAL"]).nullable(),
              iptu: z12.number().nullable(),
              price: z12.number(),
              condoFee: z12.number().nullable(),
              photos: z12.preprocess(
                (value) => typeof value === "string" ? JSON.parse(value) : value,
                z12.array(z12.string()).nullable()
              ),
              builtArea: z12.string(),
              bedrooms: z12.number(),
              suites: z12.number(),
              parkingSpots: z12.number(),
              address: z12.string(),
              addressNumber: z12.string().nullable(),
              uf: z12.string().nullable(),
              bathrooms: z12.number().nullable(),
              neighborhood: z12.string(),
              city: z12.string(),
              zipCode: z12.string(),
              elevator: z12.boolean(),
              airConditioning: z12.boolean(),
              closet: z12.boolean(),
              pool: z12.boolean(),
              sevantsRoom: z12.boolean(),
              terrace: z12.boolean(),
              coworking: z12.boolean(),
              gym: z12.boolean(),
              gourmetArea: z12.boolean(),
              partyRoom: z12.boolean(),
              petArea: z12.boolean(),
              playroom: z12.boolean(),
              residential: z12.boolean(),
              stairFlights: z12.number().nullable(),
              ownerId: z12.string().nullable(),
              usersId: z12.string().nullable(),
              createdAt: z12.date(),
              updatedAt: z12.date(),
              updatedRegistry: z12.string().nullable(),
              User: z12.object({
                name: z12.string(),
                phone: z12.string().nullable()
              }).nullable(),
              owner: z12.object({
                name: z12.string().nullable(),
                authorizationDocument: z12.string().nullable()
              }).nullable()
            })),
            metas: z12.object({
              totalPages: z12.number(),
              totalProperties: z12.number()
            })
          }),
          400: z12.object({
            message: z12.string()
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
        if (error instanceof ZodError4) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/get-all-property-by-users.routes.ts
import z13, { ZodError as ZodError5 } from "zod";

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
        querystring: z13.object({
          pageIndex: z13.coerce.number().min(0).default(0)
        }),
        params: z13.object({
          usersId: z13.string()
        }),
        response: {
          200: z13.object({
            properties: z13.array(z13.object({
              id: z13.string(),
              status: z13.enum(["PENDING", "APPROVED", "REJECTED", "REVISION"]),
              title: z13.string(),
              description: z13.string().nullable(),
              category: z13.enum(["SALE", "RENT"]).nullable(),
              typeOfProperty: z13.enum(["HOUSE", "APARTMENT", "STUDIO", "LOFT", "LOT", "LAND", "FARM", "SHOPS", "GARAGE", "BUILDING", "SHED", "NO_RESIDENCIAL"]).nullable(),
              iptu: z13.number().nullable(),
              price: z13.number(),
              condoFee: z13.number().nullable(),
              photos: z13.preprocess(
                (value) => typeof value === "string" ? JSON.parse(value) : value,
                z13.array(z13.string()).nullable()
              ),
              builtArea: z13.string(),
              bedrooms: z13.number(),
              suites: z13.number(),
              parkingSpots: z13.number(),
              address: z13.string(),
              addressNumber: z13.string().nullable(),
              uf: z13.string().nullable(),
              bathrooms: z13.number().nullable(),
              neighborhood: z13.string(),
              city: z13.string(),
              zipCode: z13.string(),
              elevator: z13.boolean(),
              airConditioning: z13.boolean(),
              closet: z13.boolean(),
              pool: z13.boolean(),
              sevantsRoom: z13.boolean(),
              terrace: z13.boolean(),
              coworking: z13.boolean(),
              gym: z13.boolean(),
              gourmetArea: z13.boolean(),
              partyRoom: z13.boolean(),
              petArea: z13.boolean(),
              playroom: z13.boolean(),
              residential: z13.boolean(),
              stairFlights: z13.number().nullable(),
              ownerId: z13.string().nullable(),
              usersId: z13.string().nullable(),
              createdAt: z13.date(),
              updatedAt: z13.date(),
              updatedRegistry: z13.string().nullable(),
              User: z13.object({
                name: z13.string(),
                phone: z13.string().nullable()
              }).nullable(),
              owner: z13.object({
                name: z13.string().nullable(),
                authorizationDocument: z13.string().nullable()
              }).nullable()
            })),
            metas: z13.object({
              totalPages: z13.number(),
              totalProperties: z13.number()
            })
          }),
          400: z13.object({
            message: z13.string()
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
        if (error instanceof ZodError5) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/get-details-property.ts
import z14, { ZodError as ZodError6 } from "zod";

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
        params: z14.object({
          propertyId: z14.string()
        }),
        response: {
          200: z14.object({
            property: z14.object({
              id: z14.string(),
              status: z14.enum(["PENDING", "APPROVED", "REJECTED", "REVISION"]),
              title: z14.string(),
              description: z14.string().nullable(),
              category: z14.enum(["SALE", "RENT"]).nullable(),
              typeOfProperty: z14.enum([
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
              iptu: z14.number().nullable(),
              price: z14.number(),
              condoFee: z14.number().nullable(),
              photos: z14.preprocess(
                (value) => typeof value === "string" ? JSON.parse(value) : value,
                z14.array(z14.string()).nullable()
              ),
              builtArea: z14.string(),
              bedrooms: z14.number(),
              suites: z14.number(),
              parkingSpots: z14.number(),
              address: z14.string(),
              addressNumber: z14.string().nullable(),
              uf: z14.string().nullable(),
              bathrooms: z14.number().nullable(),
              neighborhood: z14.string(),
              city: z14.string(),
              zipCode: z14.string(),
              elevator: z14.boolean(),
              airConditioning: z14.boolean(),
              closet: z14.boolean(),
              pool: z14.boolean(),
              sevantsRoom: z14.boolean(),
              terrace: z14.boolean(),
              coworking: z14.boolean(),
              gym: z14.boolean(),
              gourmetArea: z14.boolean(),
              partyRoom: z14.boolean(),
              petArea: z14.boolean(),
              playroom: z14.boolean(),
              residential: z14.boolean(),
              stairFlights: z14.number().nullable(),
              ownerId: z14.string().nullable(),
              usersId: z14.string().nullable(),
              createdAt: z14.date(),
              updatedAt: z14.date(),
              updatedRegistry: z14.string().nullable(),
              motiveRevision: z14.string().nullable(),
              User: z14.object({
                name: z14.string(),
                email: z14.string().nullable(),
                photo: z14.string().nullable(),
                cnpj: z14.string().nullable(),
                company: z14.string().nullable(),
                rg: z14.string().nullable(),
                cpf: z14.string().nullable(),
                phone: z14.string().nullable(),
                creci: z14.string().nullable(),
                photoCreci: z14.string().nullable()
              }).nullable(),
              owner: z14.object({
                name: z14.string().nullable(),
                phone: z14.string().nullable(),
                email: z14.string().nullable(),
                authorizationDocument: z14.string().nullable()
              }).nullable()
            }).nullable()
          }),
          400: z14.object({
            message: z14.string()
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
        if (error instanceof ZodError6) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/get-profile.routes.ts
import z15, { ZodError as ZodError7 } from "zod";

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
          200: z15.object({
            user: z15.object({
              id: z15.string(),
              name: z15.string(),
              email: z15.string(),
              description: z15.string().nullable(),
              phone: z15.string().nullable(),
              photo: z15.string().nullable(),
              cpf: z15.string().nullable(),
              rg: z15.string().nullable(),
              cnpj: z15.string().nullable(),
              company: z15.string().nullable(),
              role: z15.enum(["ADMIN", "ADVERTISER", "BROKER", "AGENT"])
            }).nullable()
          }),
          400: z15.object({
            message: z15.string()
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
        if (error instanceof ZodError7) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/list-of-properties-sold-rented-rejected.routes.ts
import z16, { ZodError as ZodError8 } from "zod";

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
      querystring: z16.object({
        pageIndex: z16.coerce.number().min(0).default(0)
      }),
      response: {
        200: z16.object({
          properties: z16.array(z16.object({
            id: z16.string(),
            title: z16.string(),
            category: z16.string(),
            status: z16.string(),
            User: z16.object({
              name: z16.string()
            }).nullable()
          })),
          metas: z16.object({
            totalPages: z16.number(),
            totalProperties: z16.number()
          })
        }),
        400: z16.object({
          message: z16.string()
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
      if (error instanceof ZodError8) {
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
import z17, { ZodError as ZodError9 } from "zod";

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
      params: z17.object({
        propertyId: z17.uuid()
      }),
      response: {
        200: z17.object({
          message: z17.string()
        }),
        400: z17.object({
          message: z17.string()
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
      if (error instanceof ZodError9) {
        return reply.status(400).send({
          message: error.message
        });
      }
    }
  });
};

// src/routes/property-review.routes.ts
import z18, { ZodError as ZodError10 } from "zod";

// src/functions/property-review.ts
import fs4 from "fs";
import path5 from "path";
import { fileURLToPath as fileURLToPath4 } from "url";
var __filename4 = fileURLToPath4(import.meta.url);
var __dirname4 = path5.dirname(__filename4);
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
      const originalPath = path5.resolve(
        __dirname4,
        "../../uploads/properties",
        filename
      );
      await fs4.promises.writeFile(originalPath, file);
      const watermarkedName = `wm-${filename}`;
      const watermarkedPath = path5.resolve(
        __dirname4,
        "../../uploads/properties",
        watermarkedName
      );
      await addWatermark(originalPath, watermarkedPath);
      photosUrl.push(`properties/${watermarkedName}`);
      await fs4.promises.unlink(originalPath);
    }
    if (!keepExistingPhotos && property.photos) {
      const oldPhotos = property.photos;
      for (const oldPhoto of oldPhotos) {
        const oldPhotoPath = path5.resolve(__dirname4, "../../uploads", oldPhoto);
        try {
          await fs4.promises.unlink(oldPhotoPath);
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
        params: z18.object({
          propertyId: z18.string().uuid()
        }),
        body: z18.object({
          title: z18.preprocess(
            (file) => file?.value,
            z18.string().trim()
          ).optional(),
          description: z18.preprocess(
            (file) => file?.value,
            z18.string().trim()
          ).optional(),
          category: z18.preprocess(
            (file) => file?.value,
            z18.enum(["SALE", "RENT"])
          ).optional(),
          typeOfProperty: z18.preprocess(
            (file) => file ? file.value : void 0,
            z18.enum([
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
          iptu: z18.preprocess(
            (file) => file?.value,
            z18.coerce.number()
          ).optional(),
          price: z18.preprocess(
            (file) => file?.value,
            z18.coerce.number()
          ).optional(),
          condoFee: z18.preprocess(
            (file) => file?.value,
            z18.coerce.number()
          ).optional(),
          builtArea: z18.preprocess((file) => file?.value, z18.string()).optional(),
          bedrooms: z18.preprocess(
            (file) => file?.value,
            z18.coerce.number()
          ).optional(),
          suites: z18.preprocess(
            (file) => file?.value,
            z18.coerce.number()
          ).optional(),
          bathrooms: z18.preprocess(
            (file) => file?.value,
            z18.coerce.number()
          ).optional(),
          parkingSpots: z18.preprocess(
            (file) => file?.value,
            z18.coerce.number()
          ).optional(),
          updatedRegistry: z18.preprocess((file) => file?.value, z18.string()).optional(),
          address: z18.preprocess(
            (file) => file?.value,
            z18.string().trim()
          ).optional(),
          addressNumber: z18.preprocess((file) => file?.value, z18.string()).optional(),
          uf: z18.preprocess((file) => file?.value, z18.string()).optional(),
          neighborhood: z18.preprocess(
            (file) => file?.value,
            z18.string().trim()
          ).optional(),
          city: z18.preprocess(
            (file) => file?.value,
            z18.string().trim()
          ).optional(),
          zipCode: z18.preprocess(
            (file) => file?.value,
            z18.string().trim()
          ).optional(),
          stairFlights: z18.preprocess(
            (file) => file?.value,
            z18.coerce.number()
          ).optional(),
          elevator: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          airConditioning: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          pool: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          sevantsRoom: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          terrace: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          closet: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          residential: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          gourmetArea: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          gym: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          coworking: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          playroom: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          petArea: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          partyRoom: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional(),
          photos: z18.custom().refine((file) => file.file).refine(
            (file) => !file || file.file.bytesRead <= 2 * 1024 * 1024,
            "File size must be less than 2MB"
          ).refine((file) => !file || file.mimetype.startsWith("image"), {
            message: "File must be an image"
          }).array().optional(),
          keepExistingPhotos: z18.preprocess(
            (val) => val?.value === "true",
            z18.coerce.boolean()
          ).optional()
        }),
        response: {
          200: z18.object({
            message: z18.string().describe(
              "Propriedade atualizada e enviada para an\xE1lise com sucesso"
            )
          }),
          400: z18.object({
            message: z18.string()
          }),
          404: z18.object({
            message: z18.string()
          }),
          500: z18.object({
            message: z18.string()
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
        if (error instanceof ZodError10) {
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
import z19 from "zod";

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
        params: z19.object({
          propertyId: z19.string()
        }),
        response: {
          204: z19.object(),
          400: z19.object({
            message: z19.string()
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
        if (error instanceof z19.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/revision-property.routes.ts
import z20 from "zod";

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
        params: z20.object({
          propertyId: z20.string()
        }),
        body: z20.object({
          motive: z20.string()
        }),
        response: {
          204: z20.object(),
          400: z20.object({
            message: z20.string()
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
        if (error instanceof z20.ZodError) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
};

// src/routes/set-featured-photo.routes.ts
import z21, { ZodError as ZodError11 } from "zod";

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
        params: z21.object({
          propertyId: z21.uuid("ID da propriedade deve ser um UUID v\xE1lido")
        }),
        body: z21.object({
          photoPath: z21.string().min(1, "O caminho da foto \xE9 obrigat\xF3rio")
        }),
        response: {
          200: z21.object({
            message: z21.string(),
            featuredPhoto: z21.string(),
            photos: z21.array(z21.string())
          }),
          400: z21.object({
            message: z21.string()
          }),
          404: z21.object({
            message: z21.string()
          }),
          500: z21.object({
            message: z21.string()
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
        if (error instanceof ZodError11) {
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
import z22 from "zod";

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
        params: z22.object({
          propertyId: z22.string()
        }),
        body: z22.object({
          state: z22.enum(["ACTIVE", "INACTIVE"])
        }),
        response: {
          204: z22.object({}),
          400: z22.object({
            message: z22.string()
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
        if (error instanceof z22.ZodError) {
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
var __filename5 = fileURLToPath5(import.meta.url);
var __dirname5 = path6.dirname(__filename5);
var app = fastify().withTypeProvider();
app.register(fastifyCors, {
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
});
var uploadsPath = join(__dirname5, "..", "uploads");
app.register(fastifyMultipart, {
  prefix: "files",
  attachFieldsToBody: true,
  limits: {
    fileSize: 2 * 1024 * 1024,
    // 2MB
    files: 15
  }
});
app.register(fastifyStatic, {
  root: uploadsPath,
  prefix: "/files/",
  decorateReply: true
});
app.register(fastifyJwt, {
  secret: env.PRIVATE_KEY_JWT,
  sign: {
    expiresIn: "7d"
  },
  cookie: {
    cookieName: "token",
    signed: false
  }
});
app.register(fastifyCookie);
if (env.NODE_ENV === "development") {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Unik API",
        version: "1.0.0"
      }
    },
    transform: jsonSchemaTransform
  });
  app.register(scalarAPIReference, {
    routePrefix: "/docs",
    configuration: {
      theme: "elysiajs"
    }
  });
}
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(routes);

// src/server.ts
app.listen({
  port: env.PORT,
  host: "0.0.0.0"
}).then(() => {
  console.log("HTTP server running!");
});
