import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
  } from '@nestjs/common'
  import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
  import { z } from 'zod'
  import { CreateProductUseCase } from '@/domain/workshop/application/use-cases/Product/create-product'
  import { ProductPresenter } from '../presenters/product-presenter'
  import { GetProductByIdUseCase } from '@/domain/workshop/application/use-cases/Product/get-product-by-id'
  import { ProductAlreadyExistsError } from '@/domain/workshop/application/use-cases/errors/product-already-exists-error'
  import { EditProductUseCase } from '@/domain/workshop/application/use-cases/Product/edit-product'
  import { FetchRecentProductsUseCase } from '@/domain/workshop/application/use-cases/Product/fetch-recent-products'
  const productSchema = z.object({
    name: z.string(),
    unitValue: z.number(),
    productAmount: z.number(),
    description: z.string(),
    photo: z.string()
  })
  const pageQueryParamSchema = z.string().optional().default("1").transform(Number).pipe(z.number().min(1))
  const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

  type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
  type ProductBodySchema = z.infer<typeof productSchema>
  @Controller('/product')
  export class ProductController {
    constructor(
      private createProduct: CreateProductUseCase,
      private getProductById: GetProductByIdUseCase,
      private fetchProduct: FetchRecentProductsUseCase,
      private editProduct: EditProductUseCase,
    ) {}
  
    @Get()
    @HttpCode(200)
    async handleFetchProduct(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
      const result = await this.fetchProduct.execute({page})
      if (result.isLeft()) {
        throw new BadRequestException()
      }
      let products: ProductPresenter[] = [];
      result.value.products.forEach(element => {
        const convert = ProductPresenter.toHTTP(element)
        products.push(convert)
      });
      return {
        products
      }
    }
  
    @Get("/:id")
    @HttpCode(200)
    async handleGetProductById(@Param() productId: string) {
      const result = await this.getProductById.execute({
        id: productId,
      })
      if (result.isLeft()) {
        throw new BadRequestException()
      }
      const product = result.value.product
      return {
        product: ProductPresenter.toHTTP(product),
      }
    }
  
    @Post()
    @HttpCode(201)
    async handleRegisterProduct(@Body(new ZodValidationPipe(productSchema)) body: ProductBodySchema) {
      const { name, unitValue, productAmount, description, photo } = body
  
      const result = await this.createProduct.execute({
        name,
        unitValue,
        productAmount,
        description,
        photo
      })
      if (result.isLeft()) {
        const error = result.value
        if (error instanceof ProductAlreadyExistsError) {
          throw new ConflictException(error.message)
        } else {
          throw new BadRequestException(error.message)
        }
      }
    }
    @Put("/:id")
    @HttpCode(204)
    async handleEditProduct(@Body(new ZodValidationPipe(productSchema)) body: ProductBodySchema, @Param("id") productId: string) {
      const { name, unitValue, productAmount, description, photo } = body
      const result = await this.editProduct.execute({
        name,
        unitValue,
        productAmount,
        description,
        photo,
        productId
      })
      console.log(result)
      if (result.isLeft()) {
        const error = result.value
        if (error instanceof ProductAlreadyExistsError) {
          throw new ConflictException(error.message)
        } else {
          throw new BadRequestException(error.message)
        }
      }
    }
  }
  