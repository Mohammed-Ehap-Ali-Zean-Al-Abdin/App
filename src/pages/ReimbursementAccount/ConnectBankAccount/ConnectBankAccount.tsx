import React from 'react';
import {View} from 'react-native';
import type {OnyxEntry} from 'react-native-onyx';
import {withOnyx} from 'react-native-onyx';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import Text from '@components/Text';
import TextLink from '@components/TextLink';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import BankAccount from '@libs/models/BankAccount';
import EnableBankAccount from '@pages/ReimbursementAccount/EnableBankAccount/EnableBankAccount';
import * as Report from '@userActions/Report';
import ONYXKEYS from '@src/ONYXKEYS';
import type {Account, ReimbursementAccount} from '@src/types/onyx';
import BankAccountValidationForm from './components/BankAccountValidationForm';
import FinishChatCard from './components/FinishChatCard';

type ConnectBankAccountOnyxProps = {
    /** User's account who is setting up bank account */
    account: OnyxEntry<Account>;
};

type ConnectBankAccountProps = ConnectBankAccountOnyxProps & {
    /** Bank account currently in setup */
    reimbursementAccount: ReimbursementAccount;

    /** Handles back button press */
    onBackButtonPress: () => void;
};

function ConnectBankAccount({reimbursementAccount, onBackButtonPress, account}: ConnectBankAccountProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();

    const handleNavigateToConciergeChat = () => Report.navigateToConciergeChat();
    const bankAccountState = reimbursementAccount.achData?.state ?? '';

    // If a user tries to navigate directly to the validate page we'll show them the EnableStep
    if (bankAccountState === BankAccount.STATE.OPEN) {
        return (
            <EnableBankAccount
                reimbursementAccount={reimbursementAccount}
                onBackButtonPress={onBackButtonPress}
            />
        );
    }

    const maxAttemptsReached = reimbursementAccount.maxAttemptsReached ?? false;
    const isBankAccountVerifying = !maxAttemptsReached && bankAccountState === BankAccount.STATE.VERIFYING;
    const isBankAccountPending = bankAccountState === BankAccount.STATE.PENDING;
    const requiresTwoFactorAuth = account?.requiresTwoFactorAuth ?? false;

    return (
        <ScreenWrapper
            testID={ConnectBankAccount.displayName}
            includeSafeAreaPaddingBottom={false}
            shouldEnablePickerAvoiding={false}
            shouldEnableMaxHeight
            style={[styles.mh2]}
        >
            <HeaderWithBackButton
                title={isBankAccountPending ? translate('connectBankAccountStep.validateYourBankAccount') : translate('connectBankAccountStep.connectBankAccount')}
                onBackButtonPress={onBackButtonPress}
            />
            {maxAttemptsReached && (
                <View style={[styles.m5, styles.flex1]}>
                    <Text>
                        {translate('connectBankAccountStep.maxAttemptsReached')} {translate('common.please')}{' '}
                        <TextLink onPress={handleNavigateToConciergeChat}>{translate('common.contactUs')}</TextLink>.
                    </Text>
                </View>
            )}
            {!maxAttemptsReached && isBankAccountPending && (
                <BankAccountValidationForm
                    requiresTwoFactorAuth={requiresTwoFactorAuth}
                    reimbursementAccount={reimbursementAccount}
                />
            )}
            {isBankAccountVerifying && (
                <FinishChatCard
                    requiresTwoFactorAuth={requiresTwoFactorAuth}
                    reimbursementAccount={reimbursementAccount}
                />
            )}
        </ScreenWrapper>
    );
}

ConnectBankAccount.displayName = 'ConnectBankAccount';

export default withOnyx<ConnectBankAccountProps, ConnectBankAccountOnyxProps>({
    account: {
        key: ONYXKEYS.ACCOUNT,
    },
})(ConnectBankAccount);
