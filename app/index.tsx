import { Host, LazyVStack, List, Picker, ScrollView, Text, useNativeState } from '@expo/ui/swift-ui';
import { frame, id, padding, pickerStyle, scrollPosition, scrollTargetLayout, tag } from '@expo/ui/swift-ui/modifiers';
import { useEffect, useState } from 'react';
import { Settings, Text as RNText, View } from 'react-native';

// Launch arguments (simctl can't scroll):
//   -scrolled 1      scroll to row 20 after a second
//   -overlay 1       render a floating button before the list (absolutely positioned), as many screens do
//   -above 1         put a segmented control (its own Host) above the list
//   -list 1          use a List instead of a ScrollView (at rest only: a List can't be scrolled from JS)
const scrolled = String(Settings.get('scrolled')) === '1';
const above = String(Settings.get('above')) === '1';
const overlay = String(Settings.get('overlay')) === '1';
const list = String(Settings.get('list')) === '1';
const rows = Array.from({ length: 40 }, (_, i) => `Row ${i + 1}`);

/** A large-title screen whose main content is a hosted SwiftUI scroll view. No header options are set. */
export default function Index() {
  const position = useNativeState<string | null>(null);
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    if (scrolled) setTimeout(() => (position.value = 'Row 20'), 1000);
  }, [position]);

  const content = list ? (
    <Host style={{ flex: 1 }}>
      <List>
        {rows.map((row) => (
          <Text key={row}>{row}</Text>
        ))}
      </List>
    </Host>
  ) : (
    <Host style={{ flex: 1 }}>
      <ScrollView modifiers={[scrollPosition(position, { anchor: 'top' })]}>
        <LazyVStack alignment="leading" modifiers={[scrollTargetLayout()]}>
          {rows.map((row) => (
            <Text key={row} modifiers={[id(row), padding({ horizontal: 20 }), frame({ height: 52 }), frame({ maxWidth: Infinity, alignment: 'leading' })]}>
              {row}
            </Text>
          ))}
        </LazyVStack>
      </ScrollView>
    </Host>
  );

  if (overlay) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ position: 'absolute', right: 20, bottom: 40, width: 56, height: 56, borderRadius: 28, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center' }}>
          <RNText style={{ color: 'white', fontSize: 28 }}>+</RNText>
        </View>
        {content}
      </View>
    );
  }
  if (!above) return content;
  return (
    <View style={{ flex: 1 }}>
      <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
        <Picker selection={filter} onSelectionChange={setFilter} modifiers={[pickerStyle('segmented'), padding({ horizontal: 16, vertical: 8 })]}>
          <Text modifiers={[tag('all')]}>All</Text>
          <Text modifiers={[tag('recent')]}>Recent</Text>
        </Picker>
      </Host>
      {content}
    </View>
  );
}
