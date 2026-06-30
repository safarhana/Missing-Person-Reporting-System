import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CreateNoteDto } from './dto/note.dto';

export class Case {
  id: number;
  name: string;
  age: number;
  lastSeenLocation: string;
  description: string;
  contactNumber: string;
  status: string;
  notes: { noteText: string; addedBy: string; date: string }[];
}

@Injectable()
export class CaseOfficerService {
  private cases: Case[] = [];
  private idCounter = 1;
  private registeredOfficers: any[] = [];

  registerOfficer(dto: any, filename?: string) {
    const newOfficer = {
      ...dto,
      file: filename || null,
      registeredAt: new Date().toISOString(),
    };
    this.registeredOfficers.push(newOfficer);
    return newOfficer;
  }

  getRegisteredOfficers() {
    return this.registeredOfficers;
  }

  create(createCaseDto: CreateCaseDto): Case {
    const newCase: Case = {
      id: this.idCounter++,
      ...createCaseDto,
      status: 'Active',
      notes: [],
    };
    this.cases.push(newCase);
    return newCase;
  }

  findAll(status?: string): Case[] {
    if (status) {
      return this.cases.filter(
        (c) => c.status.toLowerCase() === status.toLowerCase(),
      );
    }
    return this.cases;
  }

  search(q: string): Case[] {
    const query = q.toLowerCase();
    return this.cases.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.lastSeenLocation.toLowerCase().includes(query),
    );
  }

  findOne(id: number): Case {
    const foundCase = this.cases.find((c) => c.id === id);
    if (!foundCase) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }
    return foundCase;
  }

  update(id: number, updateCaseDto: UpdateCaseDto): Case {
    const existingCase = this.findOne(id);
    if (updateCaseDto.name !== undefined) existingCase.name = updateCaseDto.name;
    if (updateCaseDto.age !== undefined) existingCase.age = updateCaseDto.age;
    if (updateCaseDto.lastSeenLocation !== undefined)
      existingCase.lastSeenLocation = updateCaseDto.lastSeenLocation;
    if (updateCaseDto.description !== undefined)
      existingCase.description = updateCaseDto.description;
    if (updateCaseDto.contactNumber !== undefined)
      existingCase.contactNumber = updateCaseDto.contactNumber;
    return existingCase;
  }

  updateStatus(id: number, status: string): Case {
    const existingCase = this.findOne(id);
    existingCase.status = status;
    return existingCase;
  }

  addNote(id: number, createNoteDto: CreateNoteDto): Case {
    const existingCase = this.findOne(id);
    existingCase.notes.push({
      noteText: createNoteDto.noteText,
      addedBy: createNoteDto.addedBy,
      date: new Date().toISOString(),
    });
    return existingCase;
  }

  remove(id: number): boolean {
    const index = this.cases.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }
    this.cases.splice(index, 1);
    return true;
  }
}
