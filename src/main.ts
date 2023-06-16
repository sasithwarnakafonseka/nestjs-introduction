import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import configuration from './core/config/configuration';
import { UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { customExceptionFactory } from './core/validation/validation.const';
import { ValidationFilter } from './core/validation/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
      },
    }),
  );
  app.use(
    helmet.permittedCrossDomainPolicies({
      permittedPolicies: 'none',
    }),
  );

  app.use(
    rateLimit({
      windowMs: 2 * 60 * 1000, // 2 minutes
      max: 500, // limit each IP to 500 requests per windowMs
    }),
  );

  const whitelist = configuration().app.corsWhiteList.split(', ');
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new UnauthorizedException('Blocked by CORS policy'));
      }
    },
    credentials: true,
  });
  // app.enableCors();
  app.use(cookieParser());

  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(new ValidationPipe({ exceptionFactory: customExceptionFactory }));

  await app.listen(3000);
}
bootstrap();
