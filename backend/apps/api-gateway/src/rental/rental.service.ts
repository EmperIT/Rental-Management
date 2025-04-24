import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Rental } from '@app/commonn';
import { ClientGrpc } from '@nestjs/microservices';
import { RENTAL_SERVICE } from './constants';

@Injectable()
export class RentalService implements OnModuleInit {
  private rentalService: Rental.RentalServiceClient;

  constructor(@Inject(RENTAL_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.rentalService = this.client.getService<Rental.RentalServiceClient>(
      Rental.RENTAL_SERVICE_NAME,
    );
  }

  // Room Methods
  createRoom(createRoomDto: Rental.CreateRoomDto) {
    return this.rentalService.createRoom(createRoomDto);
  }

  findAllRooms(page: number, limit: number) {
    return this.rentalService.findAllRooms({ page, limit });
  }

  findOneRoom(id: string) {
    return this.rentalService.findOneRoom({ id });
  }

  updateRoom(id: string, updateRoomDto: Rental.UpdateRoomDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = updateRoomDto;
    return this.rentalService.updateRoom({ id, ...updateData });
  }

  removeRoom(id: string) {
    return this.rentalService.removeRoom({ id });
  }

  // Tenant Methods
  createTenant(createTenantDto: Rental.CreateTenantDto) {
    return this.rentalService.createTenant(createTenantDto);
  }

  findAllTenantsByFilter(roomId?: string, isLeadRoom?: boolean, page: number = 1, limit: number = 10) {
    if (isLeadRoom !== undefined && typeof isLeadRoom === "string") {
      isLeadRoom = isLeadRoom === 'true'
    }
    return this.rentalService.findAllTenantsByFilter({ roomId, isLeadRoom, page, limit });
  }

  findOneTenant(id: string) {
    return this.rentalService.findOneTenant({ id });
  }

  updateTenant(id: string, updateTenantDto: Rental.UpdateTenantDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = updateTenantDto;
    return this.rentalService.updateTenant({ id, ...updateData });
  }

  removeTenant(id: string) {
    return this.rentalService.removeTenant({ id });
  }

  // Invoice Methods
  createInvoice(createInvoiceDto: Rental.CreateInvoiceDto) {
    return this.rentalService.createInvoice(createInvoiceDto);
  }

  findAllInvoicesByFilter(page: number, limit: number, isPaid?: boolean, roomId?: string, month?: string) {
    return this.rentalService.findAllInvoicesByFilter({ page, limit, isPaid, roomId, month });
  }

  findOneInvoice(id: string) {
    return this.rentalService.findOneInvoice({ id });
  }

  updateInvoice(id: string, updateInvoiceDto: Rental.UpdateInvoiceDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = updateInvoiceDto;
    return this.rentalService.updateInvoice({ id, ...updateData });
  }

  removeInvoice(id: string) {
    return this.rentalService.removeInvoice({ id });
  }

  // Readings Method
  findLatestReadings(roomId: string) {
    return this.rentalService.findLatestReadings({ roomId });
  }

  // Service Methods
  getService(name: string) {
    return this.rentalService.getService({ name });
  }

  saveService(name: string, value: string, description?: string) {
    return this.rentalService.saveService({ name, value, description });
  }

  getAllServices() {
    return this.rentalService.getAllServices({});
  }

  removeService(name: string) {
    return this.rentalService.removeService({ name });
  }

  triggerInvoiceGeneration() {
    return this.rentalService.triggerInvoiceGeneration({});
  }
}