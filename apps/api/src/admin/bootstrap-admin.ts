import { NestFactory } from '@nestjs/core';
import { hash } from 'bcryptjs';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

function requireEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const usersService = app.get(UsersService);
    const email = requireEnv('ADMIN_EMAIL');
    const password = requireEnv('ADMIN_PASSWORD');
    const displayName = process.env.ADMIN_DISPLAY_NAME?.trim() || 'Admin';
    const passwordHash = await hash(password, 12);
    const admin = await usersService.upsertAdminByEmail({
      displayName,
      email,
      passwordHash,
    });

    console.log(
      `Bootstrapped admin user ${admin.email}. Use /auth/login to get an admin JWT.`,
    );
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
