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
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger'
import { Product } from '@/domain/workshop/enterprise/entities/product'
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
  @Controller('/products')
  @ApiTags('CarIntegrated')
  @ApiBearerAuth('defaultBearerAuth')
  export class ProductController {
    constructor(
      private createProduct: CreateProductUseCase,
      private getProductById: GetProductByIdUseCase,
      private fetchProduct: FetchRecentProductsUseCase,
      private editProduct: EditProductUseCase,
    ) {}
  
    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetch products by page' })
    async handleFetchProduct(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
      const result = await this.fetchProduct.execute({page})
      if (result.isLeft()) {
        throw new BadRequestException()
      }
      const products = result.value.products
      return {
        products : products.map(ProductPresenter.toHTTP)
      }
    }
  
    @Get("/:id")
    @HttpCode(200)
    //Swagger
    @ApiOperation({ summary: 'Find product by id'})
    @ApiResponse({
      status: 200,
      description: 'Car found',
      type: Product,
    })
    //Fim do Swagger
    async handleGetProductById(@Param("id") productId: string) {
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
    //Swagger
    @ApiOperation({ summary: 'Create Product'})
    @ApiResponse({
      status: 201,
      description: 'Created Product',
      type: Product,
    })
    @ApiCreatedResponse({ description: 'Created Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiBody({
      type: Product,
      description: 'Json structure for Product object'
    })
  //Fim do Swagger
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
    @Put('/:id')
    @HttpCode(204)
    //Swagger
    @ApiOperation({ summary: 'Edit Product by id'})
    @ApiOkResponse({ description: 'The resource was updated successfully' })
    @ApiNotFoundResponse({ description: 'Resource not found' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiBody({
      type: Product,
      description: 'Json structure for user object'
    })
    @ApiResponse({
      status: 200,
      description: 'Product edited',
      type: Product,
    })
    //Fim do Swagger
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
  