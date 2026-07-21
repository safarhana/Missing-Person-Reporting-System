import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { VolunteerEntity } from '../volunteer/volunteer.entity';
import { CaseOfficerEntity } from '../case_officer/case_officer.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(VolunteerEntity)
    private readonly volunteerRepository: Repository<VolunteerEntity>,

    @InjectRepository(CaseOfficerEntity)
    private readonly caseOfficerRepository: Repository<CaseOfficerEntity>,
  ) {}

  create(createAdminDto: CreateAdminDto) {
    const admin = this.adminRepository.create(createAdminDto);
    return this.adminRepository.save(admin);
  }

  findAll() {
    return this.adminRepository.find();
  }

  findByFullName(fullName: string) {
    return this.adminRepository.find({
      where: {
        fullName: Like(`%${fullName}%`),
      },
    });
  }

  async findById(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async findByUsername(username: string) {
    const admin = await this.adminRepository.findOne({
      where: { username },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async update(username: string, updateData: CreateAdminDto) {
    const admin = await this.findByUsername(username);

    admin.username = updateData.username;
    admin.fullName = updateData.fullName;
    admin.password = updateData.password;
    admin.isActive = updateData.isActive;

    return this.adminRepository.save(admin);
  }

  async updateStatus(username: string, isActive: boolean) {
    const admin = await this.findByUsername(username);

    admin.isActive = isActive;

    return this.adminRepository.save(admin);
  }

  async remove(username: string) {
    await this.findByUsername(username);

    return this.adminRepository.delete({
      username,
    });
  }

 async assignVolunteer(adminId: number, volunteerId: number) {
  const admin = await this.adminRepository.findOne({
    where: { id: adminId },
  });

  if (!admin) {
    throw new NotFoundException('Admin not found');
  }

  const volunteer = await this.volunteerRepository.findOne({
    where: { id: volunteerId },
  });

  if (!volunteer) {
    throw new NotFoundException('Volunteer not found');
  }

  await this.volunteerRepository.update(
    volunteerId,
    {
      admin,
    },
  );

  return this.volunteerRepository.findOne({
    where: { id: volunteerId },
    relations: {
      admin: true,
    },
  });
}

  

  async getVolunteers(adminId: number) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: {
        volunteers: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin.volunteers;
  }


  async removeVolunteer(adminId: number, volunteerId: number) {
    const volunteer = await this.volunteerRepository.findOne({
      where: { id: volunteerId },
      relations: {
        admin: true,
      },
    });

    if (!volunteer) {
      throw new NotFoundException('Volunteer not found');
    }

    if (!volunteer.admin || volunteer.admin.id !== adminId) {
      throw new NotFoundException(
        'Volunteer is not assigned to this admin',
      );
    }

    volunteer.admin = null;

    return this.volunteerRepository.save(volunteer);
  }

  async assignCaseOfficer(
  adminId: number,
  caseOfficerId: number,
) {
  const admin = await this.adminRepository.findOne({
    where: { id: adminId },
    relations: {
      caseOfficers: true,
    },
  });

  if (!admin) {
    throw new NotFoundException('Admin not found');
  }

  const caseOfficer =
    await this.caseOfficerRepository.findOne({
      where: { id: caseOfficerId },
    });

  if (!caseOfficer) {
    throw new NotFoundException(
      'Case Officer not found',
    );
  }

  admin.caseOfficers.push(caseOfficer);

  await this.adminRepository.save(admin);

  return this.adminRepository.findOne({
    where: { id: adminId },
    relations: {
      caseOfficers: true,
    },
  });
}
 async getCaseOfficers(adminId: number) {
  const admin = await this.adminRepository.findOne({
    where: { id: adminId },
    relations: {
      caseOfficers: true,
    },
  });

  if (!admin) {
    throw new NotFoundException('Admin not found');
  }

  return admin.caseOfficers;
}

async removeCaseOfficer(
  adminId: number,
  caseOfficerId: number,
) {
  const admin = await this.adminRepository.findOne({
    where: { id: adminId },
    relations: {
      caseOfficers: true,
    },
  });

  if (!admin) {
    throw new NotFoundException('Admin not found');
  }

  admin.caseOfficers =
    admin.caseOfficers.filter(
      (officer) =>
        officer.id !== caseOfficerId,
    );

  await this.adminRepository.save(admin);

  return admin;
}
}
