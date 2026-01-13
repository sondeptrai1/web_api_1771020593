// Platform-aware API base URL helper.
// Uses conditional imports to pick the correct implementation for web vs other platforms.
import 'host_stub.dart' if (dart.library.io) 'host_io.dart';

String getApiBaseUrl() => getApiBaseUrlImpl();
