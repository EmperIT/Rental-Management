import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Rental } from '@app/commonn';
import { ClientGrpc } from '@nestjs/microservices';
import { RENTAL_SERVICE } from './constants';
import { CloudinaryService } from '../../services/cloudinary.service';
import { promises as fs } from 'fs';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RentalService implements OnModuleInit {
  private rentalService: Rental.RentalServiceClient;

  constructor(@Inject(RENTAL_SERVICE) private client: ClientGrpc, private readonly cloudinaryService: CloudinaryService,) {}

  onModuleInit() {
    this.rentalService = this.client.getService<Rental.RentalServiceClient>(
      Rental.RENTAL_SERVICE_NAME,
    );
  }

  // Room Methods
  async createRoom(createRoomDto: Rental.CreateRoomDto, files?: Express.Multer.File[],) {
    if (files && files.length > 0) {
      createRoomDto.images = [];
      for (const file of files) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        createRoomDto.images.push(imageUrl);
        await fs.unlink(file.path);
      }
      console.log('Uploaded images:', createRoomDto.images);
    } else {
      createRoomDto.images = [];
    }
    console.log('createRoomDto:', createRoomDto);
    return lastValueFrom(this.rentalService.createRoom(createRoomDto));
  }

  findAllRooms(page: number, limit: number) {
    return this.rentalService.findAllRoomsByFilter({ page, limit });
  }

  findOneRoom(id: string) {
    return this.rentalService.findOneRoom({ id });
  }

  async updateRoom(id: string, updateRoomDto: Rental.UpdateRoomDto, files?: Express.Multer.File[]) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (files && files.length > 0) {
      const oldRoom = await lastValueFrom(this.rentalService.findOneRoom({ id }));
      if (oldRoom && oldRoom.images && oldRoom.images.length > 0) {
        for (const imageUrl of oldRoom.images) {
          // Tìm publicId từ URL Cloudinary
          const regex = /\/([^\/]+)\.[^\/.]+$/;
          const match = imageUrl.match(regex);
          const publicId = match ? match[1] : null;
      
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId); // <-- đúng publicId nhé
          }
        }
      }
      updateRoomDto.images = [];
      for (const file of files) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        updateRoomDto.images.push(imageUrl);
        await fs.unlink(file.path);
      }
    }
    const { id: _, ...updateData } = updateRoomDto;
    return lastValueFrom(this.rentalService.updateRoom({ id, ...updateData }));
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

  saveService(saveServiceDto: Rental.SaveServiceRequest) {
    return this.rentalService.saveService(saveServiceDto);
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

  // Room Service Methods
  addRoomService(addRoomServiceDto: Rental.AddRoomServiceRequest) {
    return this.rentalService.addRoomService(addRoomServiceDto);
  }

  getRoomServices(getRoomServicesRequest: Rental.GetRoomServicesRequest) {
    return this.rentalService.getRoomServices(getRoomServicesRequest);
  }

  removeRoomService(removeRoomServicesRequest: Rental.RemoveRoomServiceRequest) {
    return this.rentalService.removeRoomService(removeRoomServicesRequest);
  }

  // Asset Methods
  createAsset(createAssetDto: Rental.CreateAssetDto) {
    return this.rentalService.createAsset(createAssetDto);
  }

  getAsset(name: string) {
    return this.rentalService.getAsset({ name });
  }

  getAllAssets() {
    return this.rentalService.getAllAssets({});
  }

  updateAsset(name: string, updateAssetDto: Rental.UpdateAssetDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name: _, ...updateData } = updateAssetDto;
    return this.rentalService.updateAsset({name, ...updateData});
  }

  removeAsset(name: string) {
    return this.rentalService.removeAsset({ name });
  }

  // Room Asset Methods
  addRoomAsset(addRoomAssetDto: Rental.AddRoomAssetRequest) {
    return this.rentalService.addRoomAsset(addRoomAssetDto);
  }

  getRoomAssets(getRoomAssetsRequest: Rental.GetRoomAssetsRequest) {
    return this.rentalService.getRoomAssets(getRoomAssetsRequest);
  }

  updateRoomAsset(updateRoomAssetDto: Rental.UpdateRoomAssetRequest) {
    return this.rentalService.updateRoomAsset(updateRoomAssetDto);
  }

  removeRoomAsset(removeRoomAssetRequest: Rental.RemoveRoomAssetRequest) {
    return this.rentalService.removeRoomAsset(removeRoomAssetRequest);
  }

  // Transaction Methods
  createTransaction(createTransactionDto: Rental.CreateTransactionDto) {
    return this.rentalService.createTransaction(createTransactionDto);
  }

  findAllTransactionsByFilter(page: number, limit: number, category?: string, type?: string, startDate?: string, endDate?: string) {
    return this.rentalService.findAllTransactionsByFilter({ page, limit, category, type, startDate, endDate });
  }

  findOneTransaction(id: string) {
    return this.rentalService.findOneTransaction({ id });
  }

  updateTransaction(id: string, updateTransactionDto: Rental.UpdateTransactionDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = updateTransactionDto;
    return this.rentalService.updateTransaction({ id, ...updateData });
  }

  removeTransaction(id: string) {
    return this.rentalService.removeTransaction({ id });
  }
}