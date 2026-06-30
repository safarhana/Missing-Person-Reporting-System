import { Injectable } from '@nestjs/common';
import { VolunteerDto } from './volunteer.dto';

@Injectable()
export class VolunteerService {

  private volunteers: VolunteerDto[] = [];

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