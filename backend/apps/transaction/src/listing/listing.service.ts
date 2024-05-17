import { Injectable } from '@nestjs/common';
import { CreateListingsDto } from './dto/create-listing.dto';
import { UpdateListingsDto } from './dto/update-listing.dto';
import { Listing } from './entities/listing.entity';
import { ListingsRepository } from './listing.repository';
import { ExtendedFindOptions } from '@app/common';

@Injectable()
export class ListingService {
  constructor(private readonly listingRepository: ListingsRepository) {}

  async create(createListingsDto: CreateListingsDto) {
    const transactionTask = new Listing(createListingsDto);
    return await this.listingRepository.create(transactionTask);
  }

  async update(id: number, updateListingsDto: UpdateListingsDto) {
    return this.listingRepository.findOneAndUpdate(
      { where: { id: id } },
      updateListingsDto,
    );
  }

  async delete(id: number) {
    return this.listingRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Listing>) {
    return this.listingRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.listingRepository.findOne({ id });
  }

  }

