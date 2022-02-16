import { AuthenticationService } from "@core/services/authentication.service";

export function authInitializer(authenticationService: AuthenticationService) {
  return () => authenticationService.refreshToken().pipe();
}
