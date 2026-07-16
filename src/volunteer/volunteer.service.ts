import { Injectable } from '@nestjs/common';
import { VolunteerDto } from './volunteer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VolunteerEntity } from './volunteer.entity';
import { Repository,IsNull, Like } from 'typeorm';

@Injectable()
export class VolunteerService {

  constructor(
    @InjectRepository(VolunteerEntity)
    private volunteerRepo: Repository<VolunteerEntity>,
  ) {}

  private volunteers: VolunteerDto[] = [];

  async createUser(dto: VolunteerDto): Promise<VolunteerEntity> {
  const volunteer = this.volunteerRepo.create(dto);
  return await this.volunteerRepo.save(volunteer);
}

async updatePhone(id: number, phone: string): Promise<VolunteerEntity | null> {
  await this.volunteerRepo.update(id, { phone });

  return await this.volunteerRepo.findOne({
    where: { id },
  });
}

async updatePhnName(id: number, phone: string, fullName: string): Promise<VolunteerEntity | null> {
  await this.volunteerRepo.update(id, { phone, fullName });

  return await this.volunteerRepo.findOne({
    where: { id },
  });
}

async getUsersWithNullName(): Promise<VolunteerEntity[]> {
  return await this.volunteerRepo.find({
    where: {
      fullName: IsNull(),
    },
  });
}

async deleteUser(id: number): Promise<void> {
  await this.volunteerRepo.delete(id);
}
  getAllCases() {
    return [
      {
        id: 1,
        title: 'Missing Child',
        district: 'Dhaka',
        status: 'Active',
      },
      {
        id: 2,
        title: 'Missing Person',
        district: 'Chattogram',
        status: 'Active',
      },
    ];
  }

  getCasesByDistrict(district: string) {
    return {
      message: `Showing active cases in ${district}`,
    };
  }
   
  getCaseById(id: number) {
    return {
      id,
      title: 'Missing Child',
      district: 'Dhaka',
      status: 'Active',
    };
  }

  getAssignedCases() {
    return {
      volunteer: 'Volunteer User',
      assignedCases: [1, 2, 3],
    };
  }

  joinSearch(dto: VolunteerDto) {
    this.volunteers.push(dto);

    return {
      message: 'Volunteer joined successfully',
      data: dto,
    };
  }

 
  updateProfile(id: number, dto: VolunteerDto) {
    return {
      message: `Volunteer profile ${id} updated successfully`,
      data: dto,
    };
  }

   
  updateCaseStatus(id: number) {
    return {
      message: `Case ${id} status updated by volunteer`,
    };
  }

 
  leaveCase(id: number) {
    return {
      message: `Volunteer left case ${id}`,
    };
  }
}