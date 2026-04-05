<TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/admin")}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: "rgba(245,158,11,0.12)" },
                ]}
              >
                <Text style={styles.actionIconText}>🔧</Text>
              </View>
              <Text style={styles.actionText}>Admin Panel</Text>
            </TouchableOpacity>
          </View>

          {/* NEW ROW */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/aiupload")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "rgba(212,67,124,0.10)" }]}>
                <Text style={styles.actionIconText}>🤖</Text>
              </View>
              <Text style={styles.actionText}>AI Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/virtual-tryon")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "rgba(99,102,241,0.10)" }]}>
                <Text style={styles.actionIconText}>👗</Text>
              </View>
              <Text style={styles.actionText}>Virtual Try-On</Text>
            </TouchableOpacity>
          </View>
        </View>