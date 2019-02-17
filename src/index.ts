import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { Server } from './app';
import { config } from './config';
import { logger } from './logger';
import { XDaiChainWatcher } from './watcher';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'dainosaur-5faeb',
    clientEmail:
      'firebase-adminsdk-qh6pp@dainosaur-5faeb.iam.gserviceaccount.com',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQChLpEcWkDLjZbU\n7PYLGqKBIL+l+p8lzIaTusznC9nFcDUMgahc/gQ05MReEKHAXO2io38bcPloOy/L\nIKzmQclPpdNpnfsAQcWrGtg1R/DUfdB6rfZQvOYRjYX7W5PCE93SREMmi0CXOdaH\nsr1x1IUi9qhGqrX9S+eaNEyqljqdHrVONAEv45F802dmaBcp3IisQ2jWoR6CoS3g\nYeKljxyd3oMxSajCy4gqvPfamizeVzfGYq+nk5ex/g/GfVTNrPmMSbu9LZAiV0yB\nAYx9x+1HO4LApvdbL6voP9hSTJP5tng6/g1jY2gZ54KJJoKT6itxIKxhEPsE/bYc\nj+pPTvRNAgMBAAECggEAHJRZtZnJOG6UKpATtndUDipk4QTV2ElyKVqrf2JKDGiv\nd1a8KDUAQPK5YOZ5D9dKaZas8IwxJQqtmEpkbfWHQQCpwmX5PhvrdUHuyU/Gw57F\nayNSdBFyh/U8pwufYP/Nyr1A3OI/IzFluSz3y2m/66mpv9IAL/gYCm8wkuTNYtNp\nSOQVmLDfKARGIwH83KB35vkVKIUv+YZ+rmwv/Ly5wzwj9OKn7MOyWMfU7UVTmiXX\nbVxiFIGIPrvr0TmGMUnFoqQwjnQiekDoLzBPRqnfJJNP46S8O9r6zOmOadHwXHsN\nt01pa9g8TYAVbd6LNhhCEiAR7a8p2dXkvFnk83QUAQKBgQDdyqJ+rbSH5SS7Ujsz\nzgjfCmU8bV+EyPeSDfMcj71s/EGc9+v2yC1sH5Ld6ss9XpbtABoP1v6C74/VYFYV\nMAAtc1l9uBty5Ve0/lXJRKFWdAf1/XiNWmHPI+EH9rj/XUFeJelwqBRBOjktI3NM\nRpdtobZ1ApsBqUTzIjcym4fuTQKBgQC6CsfWDSZfPJnF+ApNyIQF/pe1IJUjc8uC\nIwV+hbdIdyyWAx1T4SMf2vV0uzTACS/OdGFVDuzEH6tFr6vIctafejzp1wNEeen7\nU49SlZMRviRDBJMgh+6B6BWOjoYxelAQqBssGPSVSHgm+yQw/WB8Cshh6hXNGZfb\ns4RirkIeAQKBgDkh463iLSj8e/PNAPcdUeeyk9V3Dy3zXuK+uStYU6FpcbVvn9cY\nRasejwSfYO9UGGjAp/YAmds8vr5mbIZUsRcEKb9a16dHMMqs4YhRJ4ZPqWVSf+VZ\nrOxg/6y/f3Q4n4gTGAkvItiSmPvpr9+sJ4HUMF3/59ILunkvDSz6J4/ZAoGBAJ2R\n0e1+l7hj6E3fJkL5CLDXEADNxuMPCReAt/+QG0sZ/L5VhvprHce2ONyUTjozzbTL\np0BWcrwtom9UOWd9tD/AVWUswcy2gTFndWVZ4AVQCQBmGIKd/qkyO0fReODhGnzx\nFIqF3Gmvxmwlm2KOx7BnpY4gqDRdb9wZsI+vzboBAoGAGo3oLrMBAQXmPk7+YzCZ\nz/JM5HCeIg7CNWHYi5aEXo0T1rm5sH8dk8k4yrTrOoFpG1xFAXcbGjJQxZURdoEx\nrL8jlmMKxPD1r0bvuxr1WD56bt6UrMOlQpN6cHSMVbSTAu37w7kRZH7MMflUorHy\niZKJkLW+WA/dDRL/nlCFiMI=\n-----END PRIVATE KEY-----\n',
  }),
  databaseURL: 'https://dainosaur-5faeb.firebaseio.com',
});

export const app = Server.bootstrap().app;

(async () => {
  try {
    await XDaiChainWatcher.init();
    logger.info(`[App] Chain watcher started.`);

    const port = config.serverPort();
    app.listen(port);
    logger.info(`[App] Server listening on port:${port}.`);
  } catch (err) {
    logger.error(`[App] ${err}`);
    process.exit(-1);
  }
})();
