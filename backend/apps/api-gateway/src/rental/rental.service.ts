import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Rental } from '@app/commonn';
import { ClientGrpc } from '@nestjs/microservices';
import { RENTAL_SERVICE } from './constants';

@Injectable()
export class RentalService implements OnModuleInit {
  private orderService: Rental.OrderServiceClient;

  constructor(@Inject(RENTAL_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.orderService = this.client.getService<Rental.OrderServiceClient>(
      Rental.ORDER_SERVICE_NAME,
    );
  }

  // Room Methods
  createRoom(createRoomDto: Rental.CreateRoomDto) {
    return this.orderService.createRoom(createRoomDto);
  }

  findAllRooms(page: number, limit: number) {
    return this.orderService.findAllRooms({ page, limit });
  }

  findOneRoom(id: string) {
    return this.orderService.findOneRoom({ id });
  }

  updateRoom(id: string, updateRoomDto: Rental.UpdateRoomDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = updateRoomDto;
    return this.orderService.updateRoom({ id, ...updateData });
  }

  removeRoom(id: string) {
    return this.orderService.removeRoom({ id });
  }

  // Tenant Methods
  createTenant(createTenantDto: Rental.CreateTenantDto) {
    return this.orderService.createTenant(createTenantDto);
  }

  findAllTenantsByFilter(roomId?: string, isLeadRoom?: boolean, page: number = 1, limit: number = 10) {
    return this.orderService.findAllTenantsByFilter({ roomId, isLeadRoom, page, limit });
  }

  findOneTenant(id: string) {
    return this.orderService.findOneTenant({ id });
  }

  updateTenant(id: string, updateTenantDto: Rental.UpdateTenantDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = updateTenantDto;
    return this.orderService.updateTenant({ id, ...updateData });
  }

  removeTenant(id: string) {
    return this.orderService.removeTenant({ id });
  }

  // Invoice Methods
  createInvoice(createInvoiceDto: Rental.CreateInvoiceDto) {
    return this.orderService.createInvoice(createInvoiceDto);
  }

  findAllInvoicesByFilter(page: number, limit: number, isPaid?: boolean, roomId?: string, month?: string) {
    return this.orderService.findAllInvoicesByFilter({ page, limit, isPaid, roomId, month });
  }

  findOneInvoice(id: string) {
    return this.orderService.findOneInvoice({ id });
  }

  updateInvoice(id: string, updateInvoiceDto: Rental.UpdateInvoiceDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = updateInvoiceDto;
    return this.orderService.updateInvoice({ id, ...updateData });
  }

  removeInvoice(id: string) {
    return this.orderService.removeInvoice({ id });
  }

  // Readings Method
  findLatestReadings(roomId: string) {
    return this.orderService.findLatestReadings({ roomId });
  }
}