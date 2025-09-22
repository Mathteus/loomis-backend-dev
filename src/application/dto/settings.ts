import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateTag {
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(6, 6)
  @IsNotEmpty()
  color: string;
}

export class UpdateTagSchema {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @Length(3, 50)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(6, 6)
  @IsOptional()
  color?: string;
}

export class UpdateTag {
  @IsArray()
  @IsNotEmpty()
  tags: UpdateTagSchema[];
}

export class DeleteTag {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class GetTag {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
