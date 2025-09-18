<script setup lang="ts">
import {
  DEFAULT_REPOS_SCAN_IGNORE_LIST,
  DEFAULT_REPOS_SCAN_MAX_DEPTH_MAX,
  DEFAULT_REPOS_SCAN_MAX_DEPTH_MIN,
} from '../../../../shared/user-settings/user-settings-defaults';
import type { UserSettings } from '../../../../shared/user-settings/user-settings.types';
import PathsControl from '../../controls/paths-control.vue';
import UniqueListControl from '../../controls/unique-list-control.vue';
import { useReposTreeStore } from '../../repos/repos-tree-store';
import { watchSettingsSection } from '../watch-settings-section';

const maxDepthOptions = new Set<UserSettings['reposScan']['maxDepth']>();

for (let i = DEFAULT_REPOS_SCAN_MAX_DEPTH_MIN; i <= DEFAULT_REPOS_SCAN_MAX_DEPTH_MAX; i += 1) {
  maxDepthOptions.add(i);
}

const reposTreeStore = useReposTreeStore();

const reposScanSettings = watchSettingsSection('reposScan', {
  onSave: async () => {
    await reposTreeStore.update(true);
  },
});
</script>

<template>
  <div class="content-flow">
    <h1>Settings</h1>
    <hr />
    <h2>Repositories</h2>

    <h3>Finding Local Repositories</h3>

    <div class="form">
      <div class="fieldset">
        <label>Base Paths</label>

        <p>
          The application scans these base paths for local repositories.<br />
          If a directory is a Git repository, its subdirectories will not be scanned further.
        </p>

        <PathsControl v-model="reposScanSettings.basePaths" />
      </div>

      <div class="fieldset">
        <label for="max-depth">Maximum Depth</label>

        <p class="small muted">
          Base paths will be scanned up to this maximum depth.<br />
          Setting to <samp>0</samp> means the base path should be the repository path.
        </p>

        <select id="max-depth" v-model="reposScanSettings.maxDepth">
          <option v-for="n in maxDepthOptions" :key="n" :value="n" :selected="n === reposScanSettings.maxDepth">
            {{ n }}
          </option>
        </select>
      </div>

      <div class="fieldset">
        <label>Ignore List</label>

        <p class="small muted">Directory names on the ignore list will be excluded from the scanning process.</p>

        <UniqueListControl
          v-model="reposScanSettings.ignoreList"
          :defaults="[...DEFAULT_REPOS_SCAN_IGNORE_LIST]"
          placeholder="Name to ignore…"
          icon="eye-closed"
          monospace
        />
      </div>
    </div>
  </div>
</template>
