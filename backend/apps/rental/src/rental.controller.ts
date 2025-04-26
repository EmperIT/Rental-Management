import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RentalService } from './rental.service';
import { Rental } from '@app/commonn';

@Controller()
export class RentalController {
  private readonly logger = new Logger(RentalController.name);

  constructor(private readonly rentalService: RentalService) {}

  // ***** ROOM MANAGEMENT *****
  
  @GrpcMethod('RentalService', 'CreateRoom')
  async createRoom(createRoomDto: Rental.CreateRoomDto): Promise<Rental.Room> {
    this.logger.log(`Creating room with number: ${createRoomDto.roomNumber}`);
    console.log('Room created successfully:', createRoomDto);
    return await this.rentalService.createRoom(createRoomDto);
  }

  @GrpcMethod('RentalService', 'FindAllRoomsByFilter')
  async findAllRoomsByFilter(dto: Rental.FindAllRoomsByFilterDto): Promise<Rental.Rooms> {
    this.logger.log(`Finding all rooms with filter: ${JSON.stringify(dto)}`);
    return this.rentalService.findAllRoomsByFilter(dto);
  }

  @GrpcMethod('RentalService', 'FindOneRoom')
  async findOneRoom(dto: Rental.FindOneRoomDto): Promise<Rental.Room> {
    this.logger.log(`Finding room with id: ${dto.id}`);
    return this.rentalService.findOneRoom(dto);
  }

  @GrpcMethod('RentalService', 'UpdateRoom')
  async updateRoom(updateRoomDto: Rental.UpdateRoomDto): Promise<Rental.Room> {
    this.logger.log(`Updating room with id: ${updateRoomDto.id}`);
    return this.rentalService.updateRoom(updateRoomDto);
  }

  @GrpcMethod('RentalService', 'RemoveRoom')
  async removeRoom(dto: Rental.FindOneRoomDto): Promise<Rental.Room> {
    this.logger.log(`Removing room with id: ${dto.id}`);
    return this.rentalService.removeRoom(dto);
  }

  // ***** TENANT MANAGEMENT *****

  @GrpcMethod('RentalService', 'CreateTenant')
  async createTenant(createTenantDto: Rental.CreateTenantDto): Promise<Rental.Tenant> {
    this.logger.log(`Creating tenant: ${createTenantDto.name}`);
    return this.rentalService.createTenant(createTenantDto);
  }

  @GrpcMethod('RentalService', 'FindAllTenantsByFilter')
  async findAllTenantsByFilter(dto: Rental.FindAllTenantsByFilterDto): Promise<Rental.Tenants> {
    this.logger.log(`Finding all tenants with filter: ${JSON.stringify(dto)}`);
    return this.rentalService.findAllTenantsByFilter(dto);
  }

  @GrpcMethod('RentalService', 'FindOneTenant')
  async findOneTenant(dto: Rental.FindOneTenantDto): Promise<Rental.Tenant> {
    this.logger.log(`Finding tenant with id: ${dto.id}`);
    return this.rentalService.findOneTenant(dto);
  }

  @GrpcMethod('RentalService', 'UpdateTenant')
  async updateTenant(updateTenantDto: Rental.UpdateTenantDto): Promise<Rental.Tenant> {
    this.logger.log(`Updating tenant with id: ${updateTenantDto.id}`);
    return this.rentalService.updateTenant(updateTenantDto);
  }

  @GrpcMethod('RentalService', 'RemoveTenant')
  async removeTenant(dto: Rental.FindOneTenantDto): Promise<Rental.Tenant> {
    this.logger.log(`Removing tenant with id: ${dto.id}`);
    return this.rentalService.removeTenant(dto);
  }

  // ***** INVOICE MANAGEMENT *****

  @GrpcMethod('RentalService', 'CreateInvoice')
  async createInvoice(createInvoiceDto: Rental.CreateInvoiceDto): Promise<Rental.Invoice> {
    this.logger.log(`Creating invoice for room: ${createInvoiceDto.roomId}`);
    return this.rentalService.createInvoice(createInvoiceDto);
  }

  @GrpcMethod('RentalService', 'FindAllInvoicesByFilter')
  async findAllInvoicesByFilter(dto: Rental.FindAllInvoicesByFilterDto): Promise<Rental.Invoices> {
    this.logger.log(`Finding all invoices with filter: ${JSON.stringify(dto)}`);
    return this.rentalService.findAllInvoicesByFilter(dto);
  }

  @GrpcMethod('RentalService', 'FindOneInvoice')
  async findOneInvoice(dto: Rental.FindOneInvoiceDto): Promise<Rental.Invoice> {
    this.logger.log(`Finding invoice with id: ${dto.id}`);
    return this.rentalService.findOneInvoice(dto);
  }

  @GrpcMethod('RentalService', 'UpdateInvoice')
  async updateInvoice(updateInvoiceDto: Rental.UpdateInvoiceDto): Promise<Rental.Invoice> {
    this.logger.log(`Updating invoice with id: ${updateInvoiceDto.id}`);
    return this.rentalService.updateInvoice(updateInvoiceDto);
  }

  @GrpcMethod('RentalService', 'RemoveInvoice')
  async removeInvoice(dto: Rental.FindOneInvoiceDto): Promise<Rental.Invoice> {
    this.logger.log(`Removing invoice with id: ${dto.id}`);
    return this.rentalService.removeInvoice(dto);
  }

  // ***** READINGS MANAGEMENT *****

  @GrpcMethod('RentalService', 'FindLatestReadings')
  async findLatestReadings(dto: Rental.FindLatestReadingsDto): Promise<Rental.ReadingsResponse> {
    this.logger.log(`Finding latest readings for room: ${dto.roomId}`);
    return { readings: await this.rentalService.findLatestReadings(dto.roomId) };
  }

  // ***** SERVICE MANAGEMENT *****

  @GrpcMethod('RentalService', 'GetService')
  async getService(request: Rental.GetServiceRequest): Promise<Rental.ServiceResponse> {
    this.logger.log(`Getting service: ${request.name}`);
    return this.rentalService.getService(request.name);
  }

  @GrpcMethod('RentalService', 'SaveService')
  async saveService(request: Rental.SaveServiceRequest): Promise<Rental.ServiceResponse> {
    this.logger.log(`Saving service: ${request.name}`);
    return this.rentalService.saveService(request);
  }

  @GrpcMethod('RentalService', 'GetAllServices')
  async getAllServices(): Promise<Rental.AllServicesResponse> {
    this.logger.log('Getting all services');
    return this.rentalService.getAllServices();
  }

  @GrpcMethod('RentalService', 'RemoveService')
  async removeService(request: Rental.GetServiceRequest): Promise<Rental.ServiceResponse> {
    this.logger.log(`Removing service: ${request.name}`);
    return this.rentalService.removeService(request.name);
  }

  // ***** ROOM SERVICE MANAGEMENT *****

  @GrpcMethod('RentalService', 'AddRoomService')
  async addRoomService(request: Rental.AddRoomServiceRequest): Promise<Rental.RoomServiceResponse> {
    this.logger.log(`Adding service ${request.serviceName} to room: ${request.roomId}`);
    return this.rentalService.addRoomService(request);
  }

  @GrpcMethod('RentalService', 'GetRoomServices')
  async getRoomServices(request: Rental.GetRoomServicesRequest): Promise<Rental.RoomServicesResponse> {
    this.logger.log(`Getting services for room: ${request.roomId}`);
    return this.rentalService.getRoomServices(request);
  }

  @GrpcMethod('RentalService', 'RemoveRoomService')
  async removeRoomService(request: Rental.RemoveRoomServiceRequest): Promise<Rental.RoomServiceResponse> {
    this.logger.log(`Removing service ${request.serviceName} from room: ${request.roomId}`);
    return this.rentalService.removeRoomService(request);
  }

  // ***** INVOICE GENERATION *****

  @GrpcMethod('RentalService', 'TriggerInvoiceGeneration')
  async triggerInvoiceGeneration(): Promise<Rental.InvoiceGenerationResponse> {
    this.logger.log('Triggering invoice generation');
    return this.rentalService.manuallyTriggerInvoiceGeneration();
  }
  
  // ***** ASSET MANAGEMENT *****

  @GrpcMethod('RentalService', 'CreateAsset')
  async createAsset(request: Rental.CreateAssetDto): Promise<Rental.Asset> {
    this.logger.log(`Creating asset: ${request.name}`);
    return this.rentalService.createAsset(request);
  }

  @GrpcMethod('RentalService', 'GetAsset')
  async getAsset(request: Rental.GetAssetRequest): Promise<Rental.Asset> {
    this.logger.log(`Getting asset: ${request.name}`);
    return this.rentalService.getAsset(request.name);
  }

  @GrpcMethod('RentalService', 'GetAllAssets')
  async getAllAssets(): Promise<Rental.AssetsResponse> {
    this.logger.log('Getting all assets');
    return this.rentalService.getAllAssets();
  }

  @GrpcMethod('RentalService', 'UpdateAsset')
  async updateAsset(request: Rental.UpdateAssetDto): Promise<Rental.Asset> {
    this.logger.log(`Updating asset: ${request.name}`);
    return this.rentalService.updateAsset(request);
  }

  @GrpcMethod('RentalService', 'RemoveAsset')
  async removeAsset(request: Rental.GetAssetRequest): Promise<Rental.Asset> {
    this.logger.log(`Removing asset: ${request.name}`);
    return this.rentalService.removeAsset(request.name);
  }

  // ***** ROOM ASSET MANAGEMENT *****

  @GrpcMethod('RentalService', 'AddRoomAsset')
  async addRoomAsset(request: Rental.AddRoomAssetRequest): Promise<Rental.RoomAssetResponse> {
    this.logger.log(`Adding asset ${request.assetName} to room: ${request.roomId}`);
    return this.rentalService.addRoomAsset(request);
  }

  @GrpcMethod('RentalService', 'GetRoomAssets')
  async getRoomAssets(request: Rental.GetRoomAssetsRequest): Promise<Rental.RoomAssetsResponse> {
    this.logger.log(`Getting assets for room: ${request.roomId}`);
    return this.rentalService.getRoomAssets(request);
  }

  @GrpcMethod('RentalService', 'UpdateRoomAsset')
  async updateRoomAsset(request: Rental.UpdateRoomAssetRequest): Promise<Rental.RoomAssetResponse> {
    this.logger.log(`Updating asset ${request.assetName} for room: ${request.roomId}`);
    return this.rentalService.updateRoomAsset(request);
  }

  @GrpcMethod('RentalService', 'RemoveRoomAsset')
  async removeRoomAsset(request: Rental.RemoveRoomAssetRequest): Promise<Rental.RoomAssetResponse> {
    this.logger.log(`Removing asset ${request.assetName} from room: ${request.roomId}`);
    return this.rentalService.removeRoomAsset(request);
  }

  // ***** TRANSACTION MANAGEMENT *****

  @GrpcMethod('RentalService', 'CreateTransaction')
  async createTransaction(request: Rental.CreateTransactionDto): Promise<Rental.Transaction> {
    this.logger.log(`Creating transaction: ${request.category} - ${request.type}`);
    return this.rentalService.createTransaction(request);
  }

  @GrpcMethod('RentalService', 'FindAllTransactionsByFilter')
  async findAllTransactionsByFilter(request: Rental.FindAllTransactionsByFilterDto): Promise<Rental.Transactions> {
    this.logger.log(`Finding transactions with filter: ${JSON.stringify(request)}`);
    return this.rentalService.findAllTransactionsByFilter(request);
  }

  @GrpcMethod('RentalService', 'FindOneTransaction')
  async findOneTransaction(request: Rental.FindOneTransactionDto): Promise<Rental.Transaction> {
    this.logger.log(`Getting transaction with id: ${request.id}`);
    return this.rentalService.findOneTransaction(request);
  }

  @GrpcMethod('RentalService', 'UpdateTransaction')
  async updateTransaction(request: Rental.UpdateTransactionDto): Promise<Rental.Transaction> {
    this.logger.log(`Updating transaction with id: ${request.id}`);
    return this.rentalService.updateTransaction(request);
  }

  @GrpcMethod('RentalService', 'RemoveTransaction')
  async removeTransaction(request: Rental.FindOneTransactionDto): Promise<Rental.Transaction> {
    this.logger.log(`Removing transaction with id: ${request.id}`);
    return this.rentalService.removeTransaction(request);
  }
}
