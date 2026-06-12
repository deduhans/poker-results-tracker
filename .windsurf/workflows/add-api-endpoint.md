---
description: How to add a new REST API endpoint to the NestJS backend
---

# Add API Endpoint Workflow

## 1. Define DTO (Data Transfer Object)

Create in `be/src/<module>/dto/`:

```typescript
// create-item.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;
}
```

## 2. Update or Create Service

In `be/src/<module>/<module>.service.ts`:

```typescript
async create(createItemDto: CreateItemDto): Promise<Item> {
  const item = this.itemRepository.create(createItemDto);
  return this.itemRepository.save(item);
}
```

## 3. Add Controller Method

In `be/src/<module>/<module>.controller.ts`:

```typescript
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Post()
@ApiOperation({ summary: 'Create new item' })
@ApiResponse({ status: 201, description: 'Item created' })
async create(@Body() createItemDto: CreateItemDto) {
  return this.service.create(createItemDto);
}
```

## 4. Update Entity (if needed)

In `be/src/<module>/entities/<module>.entity.ts`:

```typescript
@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  amount: number;
}
```

## 5. Test Locally

```bash
# Restart dev stack
docker compose -f docker-compose.dev.yml restart nestapp-dev

# Check Swagger UI at http://localhost:3101/api
```

## 6. Commit and Deploy

```bash
git add .
git commit -m "feat: add item creation endpoint"
git push origin dev
# Then trigger deploy via GitHub Actions
```
