import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { CaseOfficerService, Case } from './case_officer.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { UpdateStatusDto } from './dto/status.dto';
import { CreateNoteDto } from './dto/note.dto';
import { CreateCaseOfficerDto } from './dto/create-case-officer.dto';

@Controller('case-officer')
export class CaseOfficerController {
  constructor(private readonly caseOfficerService: CaseOfficerService) {}

  @Post()
  create(@Body() createCaseDto: CreateCaseDto): Case {
    return this.caseOfficerService.create(createCaseDto);
  }

  @Get()
  findAll(@Query('status') status?: string): Case[] {
    return this.caseOfficerService.findAll(status);
  }

  @Get('search')
  search(@Query('q') q: string): Case[] {
    return this.caseOfficerService.search(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Case {
    return this.caseOfficerService.findOne(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCaseDto: UpdateCaseDto,
  ): Case {
    return this.caseOfficerService.update(Number(id), updateCaseDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Case {
    return this.caseOfficerService.updateStatus(Number(id), updateStatusDto.status);
  }

  @Post(':id/notes')
  addNote(
    @Param('id') id: string,
    @Body() createNoteDto: CreateNoteDto,
  ): Case {
    return this.caseOfficerService.addNote(Number(id), createNoteDto);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(pdf)$/i)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'pdf'), false);
        }
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  register(
    @Body() body: CreateCaseOfficerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      message: 'Case Officer registered successfully',
      file: file ? file.filename : null,
      data: body,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string): { success: boolean } {
    const result = this.caseOfficerService.remove(Number(id));
    return { success: result };
  }
}
