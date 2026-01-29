import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ErrorService } from "./error.service";


@Controller('error')
@UseGuards(AuthGuard('jwt'))
export class ErrorController {
  constructor(private readonly errorService: ErrorService) {}
}