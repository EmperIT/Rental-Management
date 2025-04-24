import { Controller } from '@nestjs/common';
import { RentalService } from './rental.service';
import { Rental } from '@app/commonn';

@Controller()
@Rental.RentalServiceControllerMethods()
export class RentalController implements Rental.RentalServiceController {
  constructor(
    private readonly rentalService: RentalService
  ) {}

  // Room endpoints
  createRoom(request: Rental.CreateRoomDto) {
    return this.rentalService.createRoom(request);
  }

  findAllRooms(request: Rental.FindAllRoomsDto) {
    return this.rentalService.findAllRooms(request);
  }

  findOneRoom(request: Rental.FindOneRoomDto) {
    return this.rentalService.findOneRoom(request);
  }

  updateRoom(request: Rental.UpdateRoomDto) {
    return this.rentalService.updateRoom(request);
  }

  removeRoom(request: Rental.FindOneRoomDto) {
    return this.rentalService.removeRoom(request);
  }

  // Tenant endpoints
  createTenant(request: Rental.CreateTenantDto) {
    return this.rentalService.createTenant(request);
  }

  findAllTenantsByFilter(request: Rental.FindAllTenantsByFilterDto) {
    console.log(request)
    return this.rentalService.findAllTenantsByFilter(request);
  }

  findOneTenant(request: Rental.FindOneTenantDto) {
    return this.rentalService.findOneTenant(request);
  }

  updateTenant(request: Rental.UpdateTenantDto) {
    return this.rentalService.updateTenant(request);
  }

  removeTenant(request: Rental.FindOneTenantDto) {
    return this.rentalService.removeTenant(request);
  }

  // Invoice endpoints
  createInvoice(request: Rental.CreateInvoiceDto) {
    return this.rentalService.createInvoice(request);
  }

  findAllInvoicesByFilter(request: Rental.FindAllInvoicesByFilterDto) {
    return this.rentalService.findAllInvoicesByFilter(request);
  }

  findOneInvoice(request: Rental.FindOneInvoiceDto) {
    return this.rentalService.findOneInvoice(request);
  }

  updateInvoice(request: Rental.UpdateInvoiceDto) {
    return this.rentalService.updateInvoice(request);
  }

  removeInvoice(request: Rental.FindOneInvoiceDto) {
    return this.rentalService.removeInvoice(request);
  }

  // Readings endpoint
  async findLatestReadings(request: Rental.FindLatestReadingsDto): Promise<Rental.ReadingsResponse> {
    const readingsMap = await this.rentalService.findLatestReadings(request.roomId);
    return { readings: readingsMap };
  }

  // Services endpoints
  getService(request: Rental.GetServiceRequest) {
    return this.rentalService.getService(request.name);
  
  }

  saveService(request: Rental.SaveServiceRequest) {
    return this.rentalService.saveService(request);
  }

  getAllServices() {
    return this.rentalService.getAllServices();
  }

  removeService(request: Rental.GetServiceRequest) {
    return this.rentalService.removeService(request.name);
  }

  // Invoice generation endpoint
  async triggerInvoiceGeneration(): Promise<Rental.InvoiceGenerationResponse> {
    const result = await this.rentalService.manuallyTriggerInvoiceGeneration();
    return {
      success: result.success,
      message: result.message
    };
  }
}
