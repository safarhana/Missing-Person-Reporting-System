import { Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException, } from '@nestjs/common';
import { VolunteerDto } from './volunteer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VolunteerEntity } from './volunteer.entity';
import { Repository,IsNull, Like } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import * as bcrypt from 'bcrypt';
import { Mpr } from 'src/missing_person_reporter/mpr.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class VolunteerService {

  constructor(
    @InjectRepository(VolunteerEntity)
    private volunteerRepo: Repository<VolunteerEntity>,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    @InjectRepository(Mpr)
    private mprRepo: Repository<Mpr>,
    private readonly mailService: MailerService,
  ) {}

  private volunteers: VolunteerDto[] = [];

  async createUser(dto: VolunteerDto): Promise<VolunteerEntity> {

    const existingVolunteer = await this.volunteerRepo.findOne({
    where: { username: dto.username },});

  if (existingVolunteer) {
    throw new ConflictException('Username already exists');
  }
  const hashedPassword = await bcrypt.hash(dto.password, 10);
  const volunteer = this.volunteerRepo.create({ ...dto, password: hashedPassword });
  const savedVolunteer = await this.volunteerRepo.save(volunteer);

  await this.mailService.sendMail({
    to: savedVolunteer.email,
    subject: 'Volunteer Registration Successful',
    text: `Hello ${savedVolunteer.username},
         Your volunteer account has been created successfully.`,
  });

  return savedVolunteer;
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

async deleteUser(id: number): Promise<{ message: string }> {

  const volunteer = await this.volunteerRepo.findOne({
    where: { id },
  });

  if (!volunteer) {
    throw new NotFoundException('Volunteer not found');
  }
  
  await this.volunteerRepo.delete(id);
  return {
    message: `Volunteer id=${id} deleted successfully`,
  };
}

async getAllVolunteers(): Promise<VolunteerEntity[]> {
  return await this.volunteerRepo.find();
}

async getUserById(id: number): Promise<VolunteerEntity | null> {

  const volunteer = await this.volunteerRepo.findOne({
    where: { id },
  });

  if (!volunteer) {
    throw new NotFoundException('Volunteer not found');
  }

  return await this.volunteerRepo.findOne({
    where: { id },
  });
}


async updatePhone(id: number, phone: string,): Promise<VolunteerEntity | null> {

  const volunteer = await this.volunteerRepo.findOne({
    where: { id },
  });

  if (phone.length !== 11) {
  throw new BadRequestException('Phone number must be 11 digits');
}

  if (!volunteer) {
    throw new NotFoundException('Volunteer not found');
  }

  volunteer.phone = phone;

  return await this.volunteerRepo.save(volunteer);
}


async toggleStatus(
  id: number,
): Promise<VolunteerEntity | null> {

  const volunteer = await this.volunteerRepo.findOne({
    where: { id },
  });

  if (!volunteer) {
     throw new NotFoundException('Volunteer not found');
  }

  volunteer.isActive = !volunteer.isActive;

  return await this.volunteerRepo.save(volunteer);
}

async assignAdmin(
  volunteerId: number,
  adminId: number,
) {
  const volunteer = await this.volunteerRepo.findOne({
    where: { id: volunteerId },
  });

  if (!volunteer) {
    throw new NotFoundException('Volunteer not found');
  }

  const admin = await this.adminRepo.findOne({
    where: { id: adminId },
  });

  if (!admin) {
    throw new NotFoundException('Admin not found');
  }

  volunteer.admin = admin;

  
  const updatedVolunteer = await this.volunteerRepo.save(volunteer);
  await this.mailService.sendMail({
    to: updatedVolunteer.email,
    subject: 'Admin Assigned Successfully',
    text: `Hello ${updatedVolunteer.username},

    Your account has been assigned to an administrator.

    Admin Name: ${admin.fullName}
    Admin ID: ${admin.id}

    If you have any questions, please contact your assigned administrator.

    Thank you,
    Missing Person Reporting System`,
  });

  return {
    message: 'Admin assigned successfully',
    volunteer:updatedVolunteer,
  };
}

async getVolunteersByAdmin(id: number) {

  return await this.adminRepo.findOne({
    where: { id },
    relations:  {
    volunteers: true,
  },
  });
}


async removeAdmin(
  volunteerId: number,
) {

  const volunteer = await this.volunteerRepo.findOne({
    where: { id: volunteerId },
    relations:  {
    admin: true,
  },
  });

  if (!volunteer) {
   throw new NotFoundException('Volunteer not found');
  }

  volunteer.admin = null;

  await this.volunteerRepo.save(volunteer);

  return {
    message: 'Volunteer removed from admin',
  };
}

async assignMpr(
  volunteerId: number,
  mprId: number,
) {

  const volunteer = await this.volunteerRepo.findOne({
    where: { id: volunteerId },
    relations: {
      mprs: true,
    },
  });

  if (!volunteer) {
    throw new NotFoundException('Volunteer not found');
  }

  const mpr = await this.mprRepo.findOne({
    where: { id: mprId },
  });

  if (!mpr) {
    throw new NotFoundException('Missing Person Reporter not found');
  }

  volunteer.mprs.push(mpr);

  return this.volunteerRepo.save(volunteer);
}

async removeMpr(
  volunteerId: number,
  mprId: number,
) {

  const volunteer = await this.volunteerRepo.findOne({
    where: { id: volunteerId },
    relations:{
      mprs: true,
    },
  });

  if (!volunteer) {
    throw new NotFoundException('Volunteer not found');
  }

  volunteer.mprs = volunteer.mprs.filter(
    (mpr) => mpr.id !== mprId,
  );

  return this.volunteerRepo.save(volunteer);
}

}