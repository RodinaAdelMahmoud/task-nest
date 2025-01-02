import { DeepLinkService, TrieService } from '@common/helpers/services';

export class MongooseCommonModule {
  private static providers = [DeepLinkService];

  static forRoot() {
    return {
      module: MongooseCommonModule,
      imports: [],
      providers: [...this.providers, TrieService],
      exports: [...this.providers],
      global: true,
    };
  }
}
