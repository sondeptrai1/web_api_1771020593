import 'dart:io';

String getApiBaseUrlImpl() {
  // On Android emulator, use 10.0.2.2 to reach host machine's localhost.
  if (Platform.isAndroid) return 'http://10.0.2.2:5000/api';

  // On iOS simulator and other platforms, localhost works.
  return 'http://localhost:5000/api';
}
