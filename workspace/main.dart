// Dart Demo di Nemesis IDE
void main() {
  print('🎯 Halo dari Dart di Nemesis IDE!');
  
  final languages = ['Python', 'JavaScript', 'Java', 'Dart', 'TypeScript', 'C++'];
  print('Bahasa yang didukung:');
  for (final lang in languages) {
    print('  - ' + lang);
  }
  
  final now = DateTime.now();
  print('\nTimestamp: ${now.toIso8601String()}');
}
